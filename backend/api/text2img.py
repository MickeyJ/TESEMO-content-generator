import torch
from diffusers import StableDiffusionPipeline
from PIL import Image

# Replace the model version with your required version if needed
pipeline = StableDiffusionPipeline.from_pretrained(
    # "stabilityai/stable-diffusion-2-1",
    "CompVis/stable-diffusion-v1-4",
    torch_dtype=torch.float16,
)

# Running the inference on GPU with cuda enabled
# pipeline = pipeline.to("cuda")
pipeline = pipeline.to("mps")

prompt = "a unique indoor house planter with an unconventional shape and flowing wavy 3D patterns. Made of smooth, glossy ceramic in a white and light gray gradient, it exudes modern elegance. Perfect for small plants like succulents, it’s displayed on a minimalist table in a bright, stylish interior, highlighting its artistic and contemporary aesthetic."

image = pipeline(prompt=prompt).images[0]
image.show()
