from bs4 import BeautifulSoup

with open('majors.html', 'r') as f:
    content = f.read()
    soup = BeautifulSoup(content, "html.parser")

    items = soup.find('ul').find_all('li')
    names = []
    for item in items:
        name = item.text.strip()
        names.append(name)
    names.sort()
    # print('\n'.join(names))
    print("[" + ''.join(map(lambda s: f'"{s}", ', names)) + "]")