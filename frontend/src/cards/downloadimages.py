import requests
import os

# Base URL for the images
BASE_URL = "https://bang.dvgiochi.com/content/1/cards/"
DIRECTORY_NAME = 'bang_cards'
# CardComponent names extracted from the table
card_names = [
    "Barile", "Dinamite", "Mirino", "Mustang", "Prigione", "Remington", "Rev. Carabine", "Schofield",
    "Volcanic", "Winchester", "Bang!", "Birra", "Cat Balou", "Diligenza", "Duello", "Emporio", "Gatling",
    "Indiani!", "Mancato!", "Panico!", "Saloon", "Wells Fargo", "Bart Cassidy", "Black Jack", "Calamity Janet",
    "El Gringo", "Jesse Jones", "Jourdonnais", "Kit Carlson", "Lucky Duke", "Paul Regret", "Pedro Ramirez",
    "Rose Doolan", "Sid Ketchum", "Slab the Killer", "Suzy Lafayette", "Vulture Sam", "Willy the Kid",
    "Fuorilegge", "Rinnegato", "Sceriffo", "Vice"
]


# Download each image
for card in card_names:
    image_name = f"01_{card.lower().replace(' ', '').replace('!','').replace('.', '')}.png"
    image_url = BASE_URL + image_name

    response = requests.get(image_url)
    cleaned_name = image_name.replace("01_", "")

    # Check if the request was successful
    if response.status_code == 200:
        with open(os.path.join(DIRECTORY_NAME, cleaned_name), 'wb') as file:
            file.write(response.content)
        print(f"Downloaded {image_name}")
    else:
        print(f"Failed to download {image_name}")


print("Download completed!")
