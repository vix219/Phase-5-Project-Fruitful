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
            info='Shrub or small tree with smooth, light gray bark...',
            season='Spring'
        ),
        FruitType(
            fruit_name='Muscadine Grapes',
            image_url='https://vintagetexas.com/wp-content/uploads/2023/08/image-2-768x696.png',
            info='Muscadine grapes, scientifically known as Vitis rotundifolia...',
            season='Late Summer and early Fall'
        ),
        FruitType(
            fruit_name='Texas Persimon',
            image_url='https://farm9.staticflickr.com/8079/8316267175_802d4da001.jpg',
            info='Fruit fleshy, round, up to 1 inch in diameter...',
            season='Late Summer'
        ),
        FruitType(
            fruit_name='Texas Wild Loquats',
            image_url='https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhMTzt9OzLcug-UOxxXvwH-lLVTrlf7leaM5G9MSTjdou-BwDEDYjn22nsB83mZu1raA3nziDQHleGSkBRWDxRoh3foQbNOyC1fbBh6pEIk5aI2ugbTn6jvFqRbuB0lNIOWMA4rNg08Dd-U/s320/LoquatOnTree.jpg',
            info='Loquats, scientifically known as Eriobotrya japonica...',
            season='Late Spring'
        ),
        FruitType(
            fruit_name='Pricky Pear',
            image_url='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqia4jmm9Lauts54jLocVWu6uCOHC_YgF8P6hd6Zd69dVa7rHviaD7HgNB-FPCjjrPbQGUwqip4aTHVLCSJ5wdfQ',
            info='Every part of the plant is edible...',
            season='fruit-late summer, pads-all year though younger pads taste better'
        ),
        FruitType(
            fruit_name='American Elderberry',
            image_url='https://farm4.static.flickr.com/3154/2734229554_36057b12f7.jpg',
            info='American elderberry (Sambucus canadensis) is native to the Austin area...',
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
