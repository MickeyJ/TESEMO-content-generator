from PIL import Image, ImageDraw, ImageFont
import base64
import io
import os
import random
import json


def get_contrast_color(hex_color):
    # Convert hex to RGB tuple
    hex_color = hex_color.lstrip("#")
    r, g, b = tuple(int(hex_color[i : i + 2], 16) for i in (0, 2, 4))
    brightness = (r * 299 + g * 587 + b * 114) / 1000
    return "#000000" if brightness > 128 else "#FFFFFF"


# Load schemes from external JSON file
with open("schemes.json", "r") as file:
    schemes = json.load(file)

# Generate a random 6-character folder name and create the folder
folder_name = "".join(random.choices("abcdefghijklmnopqrstuvwxyz0123456789", k=6))
os.makedirs(folder_name, exist_ok=True)
print(f"Saving images to folder: {folder_name}")

# New dimensions: width 1000, row height 200 (total height = 400)
width = 1000
row_height = 200
total_height = row_height * 2

# Attempt to load a high-resolution TrueType font
try:
    font = ImageFont.truetype("arial.ttf", 24)
except IOError:
    try:
        font = ImageFont.truetype("DejaVuSans-Bold.ttf", 24)
    except IOError:
        font = ImageFont.load_default()

for scheme in schemes:
    img = Image.new("RGB", (width, total_height), color="white")
    draw = ImageDraw.Draw(img)

    # Process two rows: "light" then "dark"
    for row_index, theme in enumerate(["light", "dark"]):
        colors = scheme[theme]
        num_colors = len(colors)
        stripe_width = width // num_colors
        y_offset = row_index * row_height

        for i, (role, color) in enumerate(colors.items()):
            x0 = i * stripe_width
            y0 = y_offset
            x1 = (i + 1) * stripe_width
            y1 = y_offset + row_height
            # Draw the color block
            draw.rectangle([x0, y0, x1, y1], fill=color)

            # Prepare text: role and hex code (in uppercase)
            role_text = role
            hex_text = color.upper()

            # Compute text sizes using textbbox for each line
            bbox_role = draw.textbbox((0, 0), role_text, font=font)
            role_width = bbox_role[2] - bbox_role[0]
            role_height = bbox_role[3] - bbox_role[1]

            bbox_hex = draw.textbbox((0, 0), hex_text, font=font)
            hex_width = bbox_hex[2] - bbox_hex[0]
            hex_height = bbox_hex[3] - bbox_hex[1]

            total_text_height = role_height + hex_height + 5  # 5px gap between lines

            # Position the texts near the bottom (5px margin from bottom)
            text_start_y = y1 - total_text_height - 5

            # Center role text horizontally within stripe
            role_x = x0 + (stripe_width - role_width) / 2
            text_color = get_contrast_color(color)
            draw.text((role_x, text_start_y), role_text, fill=text_color, font=font)

            # Center hex text horizontally and place below the role text
            hex_x = x0 + (stripe_width - hex_width) / 2
            draw.text(
                (hex_x, text_start_y + role_height + 5),
                hex_text,
                fill=text_color,
                font=font,
            )

    # Save image to an in-memory buffer and generate Data URI
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    base64_data = base64.b64encode(buffer.getvalue()).decode("utf-8")
    data_uri = f"data:image/jpeg;base64,{base64_data}"

    file_path = os.path.join(folder_name, f"{scheme['name'].replace(' ', '_')}.jpg")
    img.save(file_path)

    print("Palette Name:", scheme["name"])
    print("Swatch Data URI:", data_uri)
    print("-" * 80)
