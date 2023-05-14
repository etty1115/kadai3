const form = document.getElementById('search-form');
const resultsDiv = document.getElementById('search-results');

form.addEventListener('submit', e => {
  e.preventDefault();
  resultsDiv.innerHTML = '<p>検索中...</p>';

  const experienceOptions = document.querySelectorAll('input[name="experience"]:checked');
  const selectedExperiences = Array.from(experienceOptions).map(option => option.value);

  let keyword = '';
  let category = '';

  if (selectedExperiences.includes('営業経験なし')) {
    category = '営業';
  } else if (selectedExperiences.includes('人事労務経験なし')) {
    category = '人事労務関連';
  } else if (selectedExperiences.includes('カスタマーサクセスなし')) {
    category = 'カスタマーサクセス';
  } else if (selectedExperiences.includes('saas経験なし')) {
    category = 'SaaS';
  }

  if (category !== '') {
    keyword = `おすすめ ${category} 書籍`;
  }

  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(keyword)}&maxResults=10`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const items = data.items;
      resultsDiv.innerHTML = '';

      if (items) {
        items.forEach(item => {
          const volumeInfo = item.volumeInfo;
          const title = volumeInfo.title;
          const authors = volumeInfo.authors;
          const description = volumeInfo.description;
          const imageLinks = volumeInfo.imageLinks;
          const thumbnail = imageLinks ? imageLinks.thumbnail : 'noimage.png';

          const bookDiv = document.createElement('div');
          bookDiv.classList.add('book');

          const image = document.createElement('img');
          image.src = thumbnail;
          bookDiv.appendChild(image);

          const infoDiv = document.createElement('div');
          infoDiv.classList.add('info');

          const titleElement = document.createElement('h2');
          titleElement.textContent = title;
          infoDiv.appendChild(titleElement);

          const authorsElement = document.createElement('p');
          authorsElement.textContent = '著者: ' + authors.join(', ');
          infoDiv.appendChild(authorsElement);

          const descriptionElement = document.createElement('p');
          descriptionElement.textContent = description;
          infoDiv.appendChild(descriptionElement);

          bookDiv.appendChild(infoDiv);
          resultsDiv.appendChild(bookDiv);
        });
      } else {
        resultsDiv.innerHTML = '<p>検索結果が見つかりませんでした。</p>';
      }
    })
    .catch(() => {
      resultsDiv.innerHTML = '<p>エラーが発生しました。もう一度お試しください。</p>';
    });
});
