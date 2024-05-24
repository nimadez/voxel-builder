#
# Voxel Builder Updater
#
import os
import sys
import shutil
from io import BytesIO
from urllib.request import urlopen
from zipfile import ZipFile


VBUILDER = 'https://github.com/nimadez/voxel-builder/archive/refs/heads/main.zip'
EXCLUDE = [ "voxel-builder-main", "electron", "user.backup" ]
run_bat = """@echo off
title Voxel Builder
start "" electron\electron .
"""

cwd = os.getcwd()


def main():
    DIR_SRC = cwd + '/voxel-builder-main'
    DIR_DST = cwd
    DIR_USR = cwd + '/user'
    DIR_BKP = DIR_USR + '.backup'

    remove_directory(DIR_SRC)

    try:
        print("Connecting to GitHub...")
        downloadZip(VBUILDER, DIR_DST)
        os.system("cls")
    except:
        input("Error: Unable to fetch GitHub repository, check your internet connection.")
        sys.exit(0)

    print(' --------------------------------')
    print('  Voxel Builder Updater')    
    print(' --------------------------------')
    print(' A backup copy of the "user"')
    print(' directory will be created.\n')

    if input(" Begin Update (Y/N)? ").upper() != "Y":
        remove_directory(DIR_SRC)
        sys.exit(0)

    # clear previous installation
    if os.path.exists(DIR_DST):
        if os.path.exists(DIR_USR):
            if os.path.exists(DIR_BKP):
                remove_directory(DIR_BKP)
            os.rename(DIR_USR, DIR_BKP)

        os.chdir(DIR_DST)
        for item in os.listdir(os.getcwd()):
            if item not in EXCLUDE:
                if os.path.isfile(item):
                    os.remove(item)
                elif os.path.isdir(item):
                    shutil.rmtree(item, ignore_errors=True)

    # extract repository
    print('\nSetting up voxel-builder...')
    for f in os.listdir(DIR_SRC):
        shutil.move(os.path.join(DIR_SRC, f), DIR_DST)
    os.rmdir(DIR_SRC)

    with open(DIR_DST + "/run.bat", "w") as f:
        f.write(run_bat)
    print('Done')


def downloadZip(url, destdir):
    with urlopen(url) as zip:
        with ZipFile(BytesIO(zip.read())) as zf:
            zf.extractall(destdir)


def remove_directory(dir):
    if os.path.exists(dir):
        os.chdir(dir)
        for item in os.listdir(os.getcwd()):
            if os.path.isfile(item):
                os.remove(item)
            elif os.path.isdir(item):
                shutil.rmtree(item, ignore_errors=True)
        os.chdir(cwd)
        os.rmdir(dir)


if __name__== "__main__":
    main()
    print("\nUpdate complete.")
    input()
