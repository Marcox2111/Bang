import os

def list_files_in_directory(directory_path):
    try:
        # List all files in the specified directory
        files = [f for f in os.listdir(directory_path) if os.path.isfile(os.path.join(directory_path, f))]
        return files
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

if __name__ == "__main__":
    folder_path = input("Enter the path to the folder: ")
    files = list_files_in_directory(folder_path)
    
    print("\nFiles in the folder:")
    for file in files:
        print(file)
