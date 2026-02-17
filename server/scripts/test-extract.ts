
import { instagramService } from '../src/services/instagram.service';

const url = 'https://www.instagram.com/reel/DU2bVsujzXp/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==';

async function testExtraction() {
  try {
    console.log('Testing extraction for:', url);
    const metadata = await instagramService.fetchMetadata(url);
    console.log('Success:', metadata);
  } catch (error: any) {
    console.error('Failed:', error.message);
  }
}

testExtraction();
