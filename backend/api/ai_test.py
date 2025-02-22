from openai import OpenAI
import re
import urllib.request
from .models import Author, Article
import openai
import os
import base64
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

author_prompt = 'Based on the styles of Kurt Vonnegut, Mark Twain, and Carl Sagan. Create a blend, so the most notable aspect of each their individual styles stand out and compliment each other. The writing should only be 50% or so based on these people. It should not be super obvious. Do not include anything specific from any of the work from any of these people: Kurt Vonnegut, Mark Twain, and Carl Sagan. The article should be accurate, informative, and provide unique perspectives. It should be focused on the intersectionality between technology/innovation/strategies/tools, sexuality/relationships/love/life, and money/finances/wealth/economy. It should should subtly optimistic '

def format_for_filename(input_string):
    # Replace invalid characters with an underscore or remove them
    sanitized = re.sub(r'[,<>:"/\\|?*]', '', input_string)
    # Replace spaces with underscores or dashes
    formatted = re.sub(r'\s+', '_', sanitized)
    # Convert to lowercase for consistency
    formatted = formatted.lower()
    # Optional: truncate to a reasonable length (e.g., 100 characters)
    max_length = 100
    if len(formatted) > max_length:
        formatted = formatted[:max_length]
    return formatted

def generate_article():
    client = OpenAI()

    def quick_print(title, text):
        print("\n")
        print(title)
        print("=-=-=-=-=-=-=-=-=")
        print(text)
        print("\n")

    class NewArticle:
        headline = ""
        content = ""
        image_url = ""

    article = NewArticle()

    # Headline Generation
    # =-=-=-=-=-=-=-=-=
    get_headline = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "developer",
                "content": f"Write a headline for a short-form blog/article about a trending topic. {author_prompt}",
            },
        ],
    )

    article.headline = get_headline.choices[0].message.content.replace('"', "")
    quick_print("Headline", article.headline)

    # Content Generation
    # =-=-=-=-=-=-=-=-=
    get_content = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "developer",
                "content": f"Write word short-form blog/article based on the headline {article.headline}. {author_prompt} Exclude the headline from your response. It should be between 100 and 200 words.",
            },
        ],
    )

    article.content = get_content.choices[0].message.content.replace('"', "")
    quick_print("Content", article.content)

    get_image = client.images.generate(
        model="dall-e-3",
        prompt=f"Make an image based on the following headline and article. Focus on specific, visually representable elements. Avoid ambiguous language that could be interpreted as including text. It should not include any text or watermarks. Headline: {article.headline}. Article content: {article.content}. {author_prompt}",
        size="1024x1024",
        quality="standard",
        n=1,
    )

    article.image_url = get_image.data[0].url
    quick_print("Image URL", article.image_url)
    
    def download_image(url, save_as):
        urllib.request.urlretrieve(url, save_as)

    save_as = f'frontend/public/{format_for_filename(article.headline)}.png'

    download_image(article.image_url, save_as)


def generate_article_for_author(author_id: int) -> dict:
    try:
        # Get author from database
        author = Author.objects.get(id=author_id)
        
        # Use the author's saved prompt
        system_prompt = (
            f"{author.prompt}\n\n"
            "Generate an article in the following format:\n"
            "HEADLINE: <the headline>\n"
            "BODY: <the article body>"
        )
        
        # Initialize OpenAI client
        client = openai.OpenAI(
            api_key=os.environ.get('OPENAI_API_KEY')
        )

        # Generate the article
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "Generate a new article"}
            ]
        )

        # Extract the article content
        article_text = completion.choices[0].message.content

        # Parse the headline and body using the specified format
        try:
            headline = article_text.split('HEADLINE:')[1].split('BODY:')[0].strip()
            body = article_text.split('BODY:')[1].strip()
        except IndexError:
            return {
                'success': False,
                'error': 'AI response was not in the expected format'
            }

        # Generate an image for the article
        image_response = client.images.generate(
            model="dall-e-3",
            prompt=f"Create an image for an article with headline: {headline}",
            size="1024x1024",
            quality="standard",
            n=1,
        )
        dalle_image_url = image_response.data[0].url

        # Get the absolute path to the project root and frontend directory
        BACKEND_DIR = Path(__file__).resolve().parent.parent  # Gets to backend/
        PROJECT_ROOT = BACKEND_DIR.parent  # Gets to project root
        PUBLIC_IMAGES_DIR = os.path.join(PROJECT_ROOT, 'frontend', 'public', 'images')

        logger.info(f"Project root: {PROJECT_ROOT}")
        logger.info(f"Images directory: {PUBLIC_IMAGES_DIR}")
        
        # Create filename from headline
        filename = format_for_filename(headline) + '.png'
        frontend_path = os.path.join(PUBLIC_IMAGES_DIR, filename)
        relative_path = f'/images/{filename}'

        # Log the paths
        logger.info(f"Saving image to: {frontend_path}")
        logger.info(f"Relative path will be: {relative_path}")

        # Ensure the images directory exists
        try:
            os.makedirs(PUBLIC_IMAGES_DIR, exist_ok=True)
            logger.info(f"Created/verified directory: {PUBLIC_IMAGES_DIR}")
        except Exception as e:
            logger.error(f"Failed to create directory: {e}")
            logger.error(f"Current working directory: {os.getcwd()}")
            raise

        # Download and save the image
        try:
            urllib.request.urlretrieve(dalle_image_url, frontend_path)
            logger.info(f"Successfully downloaded image from {dalle_image_url}")
        except Exception as e:
            logger.error(f"Failed to download image: {e}")
            raise

        # Verify the file exists
        if os.path.exists(frontend_path):
            logger.info(f"Verified image file exists at: {frontend_path}")
        else:
            logger.error(f"Image file not found at: {frontend_path}")

        # Read the image into binary for database storage
        try:
            with open(frontend_path, 'rb') as img_file:
                image_binary = img_file.read()
            logger.info("Successfully read image into binary")
        except Exception as e:
            logger.error(f"Failed to read image file: {e}")
            raise

        # Create and save the article
        article = Article.objects.create(
            headline=headline,
            body=body,
            image_url=relative_path,
            image=image_binary,
            author=author,
            created_by=author.created_by
        )

        return {
            'id': article.id,
            'headline': headline,
            'body': body,
            'image_url': relative_path,
            'author_id': author.id,
            'created_by': author.created_by.id,
            'success': True
        }

    except Author.DoesNotExist:
        return {
            'success': False,
            'error': 'Author not found'
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }
