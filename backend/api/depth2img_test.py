import urllib.parse as parse
import os
import requests
from PIL import Image
from depth2img import depth2img


# a function to determine whether a string is a URL or not
def is_url(string):
    try:
        result = parse.urlparse(string)
        return all([result.scheme, result.netloc, result.path])
    except:
        return False


# a function to load an image
def load_image(image_path):
    if is_url(image_path):
        return Image.open(requests.get(image_path, stream=True).raw)
    elif os.path.exists(image_path):
        return Image.open(image_path)


url = "https://external-preview.redd.it/tFDlCKNv4209Kw0weHaD3io6BwK9B_3lSkSPxJCWWLw.jpg?width=640&crop=smart&auto=webp&s=33f3f4ad6592ac842d0ad34bae7aab2c4fd77fd6"
img = load_image(url)
img.show()

depth2img("hentai girl", img)[0].show()
