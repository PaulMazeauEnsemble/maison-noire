
import fs from "fs"
import axios from "axios"

const videos = {
  "cms-scene-0-ff4c22d49203": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879334332/rendition/720p/file.mp4?loc=external&log_user=0&signature=f3454a713e3323c6a0271d819ae8aa1e8d7bf45887d5b650a770924d82f0fe51",
    "lazy": false,
    "_preloaded": true
  },
  "cms-scene-0-455617896a60": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879334368/rendition/720p/file.mp4?loc=external&log_user=0&signature=731176afc6d169170ed04887eed06c6a192f5fbf011d4eb7e8080f5c8ba7e715",
    "lazy": false,
    "_preloaded": true
  },
  "cms-scene-0-e668fcdcae18": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879334501/rendition/720p/file.mp4?loc=external&log_user=0&signature=573d66ad971c058acf4edf14c847d54e0891337e25c75f4b8d437b319fa1ae3a",
    "lazy": false,
    "_preloaded": true
  },
  "cms-scene-0-54a518ff3c86": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879338076/rendition/720p/file.mp4?loc=external&log_user=0&signature=e982243146b5fc979d10074542ed77f41765fb922eeb8c9079a1a834db2159fc",
    "lazy": false,
    "_preloaded": true
  },
  "cms-scene-0-2b9c628a3876": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879334749/rendition/720p/file.mp4?loc=external&log_user=0&signature=a4c5a6601edf124814db33316fbb400834b73ddda4b6fa59ac6bb8087896b406",
    "lazy": false,
    "_preloaded": true
  },
  "cms-scene-0-3484cac47992": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879336011/rendition/720p/file.mp4?loc=external&log_user=0&signature=b88a67263767bccd051392fb3f2cb2a690c060a276466cec75232c9aa99dd5b7",
    "lazy": false,
    "_preloaded": true
  },
  "cms-scene-1-ef049115f8b1": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879334394/rendition/720p/file.mp4?loc=external&log_user=0&signature=8954ea806a11297a33d7ac1cf5f6c5d6c5c9684bf93dcca694c2b1e65f3506ae",
    "lazy": true
  },
  "cms-scene-1-c1751f02715e": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879335276/rendition/720p/file.mp4?loc=external&log_user=0&signature=675717a689cdd604609a7862db7f099e5d43100b5b0a17a4fadefbadc830b528",
    "lazy": true
  },
  "cms-scene-1-cd5bf0f9921f": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879335030/rendition/720p/file.mp4?loc=external&log_user=0&signature=44938b2d52645ce70844264ec6bc56a403a9bbaf2ee8e03f2cb2740bb2fc85c5",
    "lazy": true
  },
  "cms-scene-1-6f75d6c3dcbc": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879338060/rendition/720p/file.mp4?loc=external&log_user=0&signature=5ba68cb987013f7010850c9e681df710a2cf919f434c191669c901274e430500",
    "lazy": true
  },
  "cms-scene-1-bb60d5b32328": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879335585/rendition/720p/file.mp4?loc=external&log_user=0&signature=86960ab2b5956db17044218e656d510fb7775485d059dcef6a455156f8c4364d",
    "lazy": true
  },
  "cms-scene-2-95dd31725c65": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879335300/rendition/720p/file.mp4?loc=external&signature=0bbda1ecfff5817dfb57bdae5a33b78aebe3e5735f1efb1ca8c8e02803bb65c9",
    "lazy": true
  },
  "cms-scene-2-254c51b06469": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879335471/rendition/720p/file.mp4?loc=external&log_user=0&signature=0a33d9211fd9d1ba5035d64495ec8d54a0d3cd0631c2b2d78c205eeeb94730cd",
    "lazy": true
  },
  "cms-scene-2-2bf0dd0eb7c4": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879338099/rendition/720p/file.mp4?loc=external&signature=630c72f2af88f716e685274b856c8d5a2d1adf9ce259f3eb62542fdb79353585",
    "lazy": true
  },
  "cms-scene-2-27f76fc30ca8": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879335419/rendition/720p/file.mp4?loc=external&log_user=0&signature=a5f8ea9559cf9d2048c92249835109b09e47a1365cd7ef11d0302c2afc84887e",
    "lazy": true
  },
  "cms-scene-2-2072fc20fa44": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879335991/rendition/720p/file.mp4?loc=external&signature=53c85a9bcaf504e8798ac073711428eaf7a87f6fc7a9ac38816760c5599783e7",
    "lazy": true
  },
  "cms-scene-2-2abdbff15fbb": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879335969/rendition/720p/file.mp4?loc=external&signature=17be8489a53a8448c5066df1b8d62e0f8ff62d1acaf8a8652a1ee3e2e047503d",
    "lazy": true
  },
  "cms-scene-3-8d060d5bdb90": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879334807/rendition/720p/file.mp4?loc=external&log_user=0&signature=0b33f82d5b208d2aeda48a3c1f3c446893f5a6db8453af50095b6cf1a30f7326",
    "lazy": true
  },
  "cms-scene-3-41b8b29f05ec": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879334836/rendition/720p/file.mp4?loc=external&signature=6e107860470ceb1de1a1794e0d40e9b406a0d7ac6cf686f2997ae4a589211018",
    "lazy": true
  },
  "cms-scene-3-6f36cb9fd624": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879335756/rendition/720p/file.mp4?loc=external&log_user=0&signature=ead616df9dfbc178681fc04b2799c9ec1582b8ce5c120169d4fe147af7b9c832",
    "lazy": true
  },
  "cms-scene-3-9803da22062d": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879334983/rendition/720p/file.mp4?loc=external&signature=9c840281216b2f07e2b20d8398ac59477f31e119bd53a58843a45f9c051674a3",
    "lazy": true
  },
  "cms-scene-3-8467dac1d683": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879334313/rendition/720p/file.mp4?loc=external&signature=df6deb182c829198f9ff8e31bb25efd3d5966bb2981f020b43c3804b72e666c7",
    "lazy": true
  },
  "cms-scene-3-20363c1d56a1": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879335782/rendition/720p/file.mp4?loc=external&log_user=0&signature=7fab85feac1fd3e8a5de71830c5d478a07578f71cb2326a080919c673c0829cd",
    "lazy": true
  },
  "cms-scene-4-cfa84c58f974": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879334888/rendition/720p/file.mp4?loc=external&log_user=0&signature=758856c975bc155445c7e7c7326fe4e77957af371ba192ab5e8e05525fc1e0c4",
    "lazy": true
  },
  "cms-scene-4-5cdb7cbe7620": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879336045/rendition/720p/file.mp4?loc=external&log_user=0&signature=4fe8621c58c80a3efa6f03ba755bc62ce3b1837ca5b2dae73098fb2cf6668157",
    "lazy": true
  },
  "cms-scene-4-046c93f74c19": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879335152/rendition/720p/file.mp4?loc=external&signature=6a2131d9e7eb15dbe8fb4695fa63afbb8cc24becc4949c87956dd03264dd262e",
    "lazy": true
  },
  "cms-scene-4-b6c53a311d0b": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879338147/rendition/720p/file.mp4?loc=external&log_user=0&signature=807e080196197bacf15cb4299d35c8020897f2e170244b36543d2eb702bcb2ad",
    "lazy": true
  },
  "cms-scene-4-57883b9ad470": {
    "url": "https://player.vimeo.com/progressive_redirect/playback/879343545/rendition/720p/file.mp4?loc=external&log_user=0&signature=6c031361190bcc31984b26b8fa75f2d7f19100d385e89afa131608168dd6739f",
    "lazy": true
  }
}

async function downloadVideo(url, filename) {
  try {

    console.log("-----> try", url)
    
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    const videoFile = fs.createWriteStream(filename);

    response.data.pipe(videoFile);

    return new Promise((resolve, reject) => {
      videoFile.on('finish', () => {
        videoFile.close();
        console.log(`Video from ${url} saved to ${filename}`);
        resolve();
      });

      videoFile.on('error', (err) => {
        console.error(`Error saving video from ${url}: ${err.message}`);
        reject(err);
      });
    });
  } catch (error) {
    console.error(`Error downloading video from ${url}: ${error.message}`);
    return Promise.reject(error);
  }
}

async function downloadAll(videos) {

  let promises = []

  for (const key in videos) {
    console.log("key", key, videos[key].url)
    promises.push(downloadVideo(videos[key].url, `${key}.mp4`))
  }

  await Promise.all(promises)
}


// const foo = "https://player.vimeo.com/progressive_redirect/playback/879334332/rendition/720p/file.mp4?loc=external&log_user=0&signature=f3454a713e3323c6a0271d819ae8aa1e8d7bf45887d5b650a770924d82f0fe51"

// downloadVideo(foo, 'my-file.mp4')
// downloadAll(videos)


for (const key in videos) {
  console.log(`${key}.mp4`)
}
