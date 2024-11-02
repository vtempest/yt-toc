

async function fetchTranscriptOfficialYoutube() {
  var videoPageBody = document.body.innerHTML;


  //youtube bot limiting
  if (videoPageBody?.error  ||
    videoPageBody.includes('class="g-recaptcha"') ||
    !videoPageBody.includes('"playabilityStatus":') 
  )
    return { error: true };



  var videoObj = videoPageBody.replace("\n", "")
  .split('"captions":')?.[1]
  ?.split(',"videoDetails')[0]
  

  if (!videoObj) return {error:1}

  const captions = JSON.parse(videoObj)?.playerCaptionsTracklistRenderer;

  if (!captions?.captionTracks)
    return { error: true };

  const track = captions.captionTracks.find(
    (track) => track.languageCode === "en"
  );

  if (!track) return { error: true };

  console.log(track.baseUrl);
  const transcriptBody = await (await fetch(track.baseUrl)).text();

  if (transcriptBody.error) return { error: true };

  const results = [
    ...transcriptBody.matchAll(
      /<text start="([^"]*)" dur="([^"]*)">([^<]*)<\/text>/g
    ),
  ];

  var transcript = results.map(([, start, duration, text]) => ({
    text,
    duration: parseFloat(duration),
    offset: parseFloat(start),
    lang: track.languageCode,
  }));

  var content = "";
  var timestamps = [];
  transcript.forEach(({ offset, text }) => {
    timestamps.push([content.length, Math.floor(offset, 0)]);

    content += text + " ";
  });

  return { content, timestamps };
}


document.addEventListener("DOMContentLoaded", async () => {

  var  { content, timestamps } = await fetchTranscriptOfficialYoutube();
  console.log(content);

});

// press space to go to next
document.addEventListener("keydown", async (e) => {
  if (e.code === "Tab") {
    e.stopPropagation();
    e.preventDefault();


    
  var  { content, timestamps } = await fetchTranscriptOfficialYoutube();
  console.log(content);

  // alert(content)

  document.head.innerHTML = "";

  document.body.innerHTML = content;
  }
});
