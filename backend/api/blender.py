import bpy
import math
import random
import colorsys


def create_thing():

    radius_step = 0.1
    current_radius = 0.1
    number_triangles = 200

    for i in range(number_triangles):

        current_radius = current_radius + radius_step

        bpy.ops.mesh.primitive_circle_add(vertices=100, radius=current_radius)

        triangle_mesh = bpy.context.active_object

        degrees = -90
        radians = math.radians(degrees)
        triangle_mesh.rotation_euler.x = radians
        triangle_mesh.rotation_euler.z = i / number_triangles * 10

        bpy.ops.object.convert(target="CURVE")

        triangle_mesh.data.bevel_depth = 0.05
        triangle_mesh.data.bevel_resolution = 16

        bpy.ops.object.shade_smooth()

        hue = i / number_triangles
        rgb = colorsys.hsv_to_rgb(
            hue, 1, 1
        )  # Convert HSV to RGB (fully saturated and bright)

        # Create a new material
        mat = bpy.data.materials.new(name=f"RainbowMaterial_{i}")
        mat.use_nodes = True

        # Access the material's node tree
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        if bsdf:
            # Assign the RGB color to the Base Color input
            bsdf.inputs["Base Color"].default_value = (*rgb, 1)  # RGBA

        if triangle_mesh.data.materials:
            triangle_mesh.data.materials[0] = mat  # Replace the existing material
        else:
            triangle_mesh.data.materials.append(mat)  # Add the new material


create_thing()


import bpy
import bmesh


def create_circular_plane(
    radius=1.0, segments=32, extrusions=5, extrusion_height=0.2, scaling_factors=None
):
    # Create a new mesh and object
    mesh = bpy.data.meshes.new(name="CircularPlaneMesh")
    obj = bpy.data.objects.new(name="CircularPlane", object_data=mesh)

    # Link the object to the scene collection
    bpy.context.scene.collection.objects.link(obj)

    # Create a new BMesh
    bm = bmesh.new()

    # Create the circle
    bmesh.ops.create_circle(bm, cap_ends=True, radius=radius, segments=segments)
    bmesh.ops.contextual_create(bm, geom=bm.edges)

    # Ensure lookup table is up-to-date
    bm.faces.ensure_lookup_table()

    # Get the face to extrude (assumes only one face exists)
    base_face = bm.faces[0]

    # Default scaling factors if none are provided
    if scaling_factors is None:
        scaling_factors = [1.0] * extrusions

    for i in range(extrusions):
        # Extrude the face
        result = bmesh.ops.extrude_face_region(bm, geom=[base_face])
        extruded_faces = [
            f for f in result["geom"] if isinstance(f, bmesh.types.BMFace)
        ]
        verts = [v for v in result["geom"] if isinstance(v, bmesh.types.BMVert)]

        # Move the extruded face upward
        bmesh.ops.translate(bm, verts=verts, vec=(0, 0, extrusion_height))

        # Scale the extruded vertices outward
        scale_factor = scaling_factors[i] if i < len(scaling_factors) else 1.0
        relative_scale = (
            scale_factor / scaling_factors[0]
        )  # Scale relative to the initial size

        bmesh.ops.scale(bm, verts=verts, vec=(relative_scale, relative_scale, 1))

        bm.faces.ensure_lookup_table()
        # Update the base face for the next extrusion
        #        base_face = [f for f in bm.faces if not f.select][0]
        base_face = extruded_faces[0]

    # Finalize the BMesh into the Mesh
    bm.to_mesh(mesh)
    bm.free()


# Create a circular plane with default parameters
create_circular_plane(
    radius=1,
    segments=100,
    extrusions=7,
    extrusion_height=0.2,
    scaling_factors=[1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0],
)
