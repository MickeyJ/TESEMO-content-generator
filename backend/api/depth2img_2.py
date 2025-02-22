import torch
import requests
from PIL import Image
from diffusers import StableDiffusionDepth2ImgPipeline
import urllib.parse as parse
import os
import requests

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


pipe = StableDiffusionDepth2ImgPipeline.from_pretrained(
    "stabilityai/stable-diffusion-2-depth",
    torch_dtype=torch.float16,
).to("cuda")

img = load_image("https://www.thesprucepets.com/thmb/lE6PNkkthkF_osRnyxjhAwhsl6k=/2098x1428/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1020755214-2b4b78c2b0c0458fbc0a2a99356c6e9b.jpg")
img.show()

prompt = "lion"
pipe(prompt=prompt, image=img, negative_prompt=None, strength=0.7).images[0].show()