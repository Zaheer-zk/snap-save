
const instagramGetUrl = require('instagram-url-direct');

const url = 'https://www.instagram.com/reel/DU2bVsujzXp/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==';

async function run() {
  try {
    console.log('Testing extraction for:', url);
    const result = await instagramGetUrl(url);
    console.log('Success:', result);
  } catch (error: any) {
    console.error('Failed:', error.message);
  }
}

run();
