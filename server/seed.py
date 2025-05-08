#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, FruitType

def create_fruit_types():
    return [
        FruitType(
            fruit_name='Texas Mulberry',
            image_url='https://sptreeservice.com/wp-content/uploads/2021/06/A-Guide-To-Caring-For-Texas-Mulberry-Trees-And-Emergency-Tree-Service-_-Fort-Worth-TX.jpg',
            info='The Texas mulberry is a small, drought-tolerant tree native to the southwestern U.S., producing sweet, purple-red berries in clusters. It thrives in arid conditions and is often used in xeriscaping or as an ornamental tree. The berries are edible and can be enjoyed fresh or made into jams and pies.',
            season='Late Spring - Early Summer'
        ),
        FruitType(
            fruit_name='Muscadine Grapes',
            image_url='https://vintagetexas.com/wp-content/uploads/2023/08/image-2-768x696.png',
            info='Native to the southeastern U.S., muscadine grapes are known for their thick skin and bold, sweet-to-tart flavor. They/re rich in antioxidants and vitamin C and are commonly used in wines, juices, and jams. The grapes thrive in hot, humid climates and are more disease-resistant than many other grape varieties.',
            season='Late Summer and early Fall'
        ),
        FruitType(
            fruit_name='Texas Persimon',
            image_url='https://farm9.staticflickr.com/8079/8316267175_802d4da001.jpg',
            info='The Texas Persimmon (Diospyros texana) is a small, deciduous tree native to the southwestern U.S., particularly Texas. It produces small, black, astringent fruit that becomes sweet once fully ripe, often after frost. The tree is drought-tolerant and commonly used in landscaping or for wildlife, as its fruit attracts birds and mammals.',
            season='Mid - Late Summer'
        ),
        FruitType(
            fruit_name='Texas Wild Loquats',
            image_url='https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhMTzt9OzLcug-UOxxXvwH-lLVTrlf7leaM5G9MSTjdou-BwDEDYjn22nsB83mZu1raA3nziDQHleGSkBRWDxRoh3foQbNOyC1fbBh6pEIk5aI2ugbTn6jvFqRbuB0lNIOWMA4rNg08Dd-U/s320/LoquatOnTree.jpg',
            info='Texas Wild Loquats (Eriobotrya japonica) are small evergreen trees native to parts of Texas, producing small, yellow-orange fruits with a sweet, tangy flavor. The fruit is commonly eaten fresh or used in jams and jellies. The tree is drought-tolerant and thrives in well-drained soils, often found in landscaping or as an ornamental due to its attractive foliage and fruit.',
            season='Late Spring'
        ),
        FruitType(
            fruit_name='Prickly Pear',
            image_url='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqia4jmm9Lauts54jLocVWu6uCOHC_YgF8P6hd6Zd69dVa7rHviaD7HgNB-FPCjjrPbQGUwqip4aTHVLCSJ5wdfQ',
            info='Texas Prickly Pear (Opuntia engelmannii) is a type of cactus native to Texas, known for its flat, paddle-shaped pads and vibrant, colorful fruit called "tunas." The pads are edible when peeled and can be grilled or used in dishes, while the fruit is sweet and often used in jellies or juices. This hardy cactus thrives in dry, hot climates and is a key part of the local desert ecosystem.',
            season='Fruit Late summer - Fall. Pads-all year though younger pads taste better'
        ),
        FruitType(
            fruit_name='Texas Elderberry',
            image_url='https://farm4.static.flickr.com/3154/2734229554_36057b12f7.jpg',
            info='Texas Elderberry (Sambucus texana) is a native shrub found in Texas, known for its clusters of small, white flowers that bloom in the spring and produce dark purple-black berries in late summer. The berries are used in jams, jellies, and syrups, but should be cooked as raw berries can be toxic. The shrub thrives in moist, well-drained soils and is often found along streambanks and in woodland areas.',
            season='Mid Summer'
        ),
          FruitType(
            fruit_name='Texas Common Fig',
            image_url='https://www.sierravistagrowers.net/sites/default/files/texas%20everbearing%20figs_0.JPG',
            info='Texas Common Fig (Ficus carica) is a deciduous fruit tree well-suited to the Texas climate, producing sweet, pear-shaped fruits that range in color from green to dark purple. The fruit is eaten fresh or used in preserves, and the tree thrives in warm, sunny locations with well-drained soil. It’s a popular choice for home gardens due to its low maintenance and productive yields.',
            season='Summer'
        )
    ]

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        # Clear old data
        db.session.execute(db.delete(FruitType))
        db.session.commit()

        # Create and add new fruit types
        fruits = create_fruit_types()
        db.session.add_all(fruits)
        db.session.commit()

        print("Seed completed.")
