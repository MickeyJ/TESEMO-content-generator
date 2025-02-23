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

author_prompt = "Based on the styles of Kurt Vonnegut, Mark Twain, and Carl Sagan. Create a blend, so the most notable aspect of each their individual styles stand out and compliment each other. The writing should only be 50% or so based on these people. It should not be super obvious. Do not include anything specific from any of the work from any of these people: Kurt Vonnegut, Mark Twain, and Carl Sagan. The article should be accurate, informative, and provide unique perspectives. It should be focused on the intersectionality between technology/innovation/strategies/tools, sexuality/relationships/love/life, and money/finances/wealth/economy. It should should subtly optimistic "


def format_for_filename(input_string):
    # Replace invalid characters with an underscore or remove them
    sanitized = re.sub(r'[,<>:"/\\|?*]', "", input_string)
    # Replace spaces with underscores or dashes
    formatted = re.sub(r"\s+", "_", sanitized)
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

    save_as = f"frontend/public/{format_for_filename(article.headline)}.png"

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
        client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

        # Generate the article
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "Generate a new article"},
            ],
        )

        # Extract the article content
        article_text = completion.choices[0].message.content

        # Parse the headline and body using the specified format
        try:
            headline = article_text.split("HEADLINE:")[1].split("BODY:")[0].strip()
            body = article_text.split("BODY:")[1].strip()
        except IndexError:
            return {
                "success": False,
                "error": "AI response was not in the expected format",
            }

        # Generate an image for the article
        image_response = client.images.generate(
            model="dall-e-3",
            prompt=f"""Create a minimalist, simple illustration for this headline: {headline}

            Style guidelines:
            - Use a minimal color palette (5-10 colors maximum)
            - Plenty of negative space
            - Avoid complex details or textures
            - Simple, iconic representation
            - Modern, flat design aesthetic
            - No text or typography
            - Single focal point

            The image should be elegant and professional and classy.""",
            size="1024x1024",
            quality="standard",
            n=1,
        )
        dalle_image_url = image_response.data[0].url

        # Download image directly to binary
        image_response = urllib.request.urlopen(dalle_image_url)
        image_binary = image_response.read()

        # Create and save the article first with a temporary image_url
        article = Article.objects.create(
            headline=headline,
            body=body,
            image=image_binary,
            image_url="",  # Temporary empty URL
            author=author,
            created_by=author.created_by,
        )

        # Now update the article with the correct image URL
        article.image_url = f"/api/articles/{article.id}/image/"
        article.save()

        # Include the full URL in the response
        image_url = f"/api/articles/{article.id}/image/"  # Keep the DB URL as is

        return {
            "id": article.id,
            "headline": headline,
            "body": body,
            "image_url": image_url,  # Frontend will prepend base URL
            "author_id": author.id,
            "created_by": author.created_by.id,
            "success": True,
        }

    except Author.DoesNotExist:
        return {"success": False, "error": "Author not found"}
    except Exception as e:
        return {"success": False, "error": str(e)}
