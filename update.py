#!/usr/bin/env python3
#
# Voxel Builder Updater


import os, sys, shutil
from io import BytesIO
from urllib.request import urlopen
from zipfile import ZipFile


ARCHIVE = "https://github.com/nimadez/voxel-builder/archive/refs/heads/main.zip"
EXCLUDE = [ "voxel-builder-main", "electron", "voxel-builder-backup.zip" ]


def main():
    DIR_ROOT = os.getcwd()
    DIR_SRC = DIR_ROOT + '/voxel-builder-main'
    FILE_BKP = DIR_ROOT + '/voxel-builder-backup.zip'

    print('-----------------------')
    print(' Voxel Builder Updater ')    
    print('-----------------------\n')

    # backup repository
    zip_directory(DIR_ROOT, FILE_BKP)
    print("- Backup archive created.")
    print("- The /electron directory is ignored.\n")

    # download archive
    try:
        remove_directory(DIR_SRC)
        print("Connecting to GitHub...")
        downloadZip(ARCHIVE, DIR_ROOT)
        print("Downloaded.")
    except:
        input("Error: Unable to download repository, check your internet connection.")
        sys.exit(0)

    if input("\nBegin Update (Y)? ").upper() == "Y":
        # clear directory
        if os.path.exists(DIR_ROOT):
            os.chdir(DIR_ROOT)
            for item in os.listdir(DIR_ROOT):
                if item not in EXCLUDE:
                    if os.path.isfile(item):
                        os.remove(item)
                    elif os.path.isdir(item):
                        shutil.rmtree(item, ignore_errors=True)

        # extract repository
        print('\nExtracting voxel-builder archive...')
        for i in os.listdir(DIR_SRC):
            if i != 'electron':
                shutil.move(os.path.join(DIR_SRC, i), DIR_ROOT)
        shutil.rmtree(DIR_SRC)
        print('Done')

        print("\nUpdate complete.")
    else:
        remove_directory(DIR_SRC)
        print("\nUpdate canceled.")


def downloadZip(url, destdir):
    with urlopen(url) as zip:
        with ZipFile(BytesIO(zip.read())) as zf:
            zf.extractall(destdir)


def zip_directory(directory, output_zip):
    with ZipFile(output_zip, 'w') as zipf:
        for root, dirs, files in os.walk(directory):
            if "electron" in dirs:
                dirs.remove("electron")
            for f in files:
                if f not in EXCLUDE:
                    file_path = os.path.join(root, f)
                    arcname = os.path.relpath(file_path, directory)
                    zipf.write(file_path, arcname)


def remove_directory(dir):
    if os.path.exists(dir):
        os.chdir(dir)
        for item in os.listdir(os.getcwd()):
            if os.path.isfile(item):
                os.remove(item)
            elif os.path.isdir(item):
                shutil.rmtree(item, ignore_errors=True)
        os.chdir(os.getcwd())
        os.rmdir(dir)


if __name__== "__main__":
    try:
        main()
    except KeyboardInterrupt:
        pass
