from PIL import Image, ImageDraw
import base64
import io

# Five color schemes
schemes = [
    {
        "name": "Serene Spark",
        "colors": ["#0b0c10", "#1f2833", "#c5c6c7", "#66fcf1", "#45a29e"]
    },
    {
        "name": "Optimistic Afterglow",
        "colors": ["#231f20", "#f1592a", "#f1e8e6", "#f7c59f", "#8fcfd1"]
    },
    {
        "name": "Matte Momentum",
        "colors": ["#2d2d2a", "#999b84", "#d9cb9e", "#f2ebc5", "#4c5454"]
    },
    {
        "name": "Vivid Clarity",
        "colors": ["#0a1823", "#19456b", "#f1faee", "#ffb703", "#fb8500"]
    },
    {
        "name": "Subtle Radiance",
        "colors": ["#192a3e", "#424c55", "#f4effc", "#fcb5ac", "#8cbfbf"]
    }
]

# Dimensions for the swatch images
width = 500   # total width
height = 100  # total height
stripe_count = 5

for scheme in schemes:
    img = Image.new("RGB", (width, height), color="white")
    draw = ImageDraw.Draw(img)

    stripe_width = width // stripe_count

    # Draw each color as a vertical stripe
    for i, color in enumerate(scheme["colors"]):
        x0 = i * stripe_width
        y0 = 0
        x1 = (i + 1) * stripe_width
        y1 = height
        draw.rectangle([x0, y0, x1, y1], fill=color)

    # Save to an in-memory buffer as JPEG
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    base64_data = base64.b64encode(buffer.getvalue()).decode("utf-8")
    
    data_uri = f"data:image/jpeg;base64,{base64_data}"

    print("Palette Name:", scheme["name"])
    print("Hex Codes:", ", ".join(scheme["colors"]))
    print("Swatch Data URI:", data_uri)
    print("-" * 80)
