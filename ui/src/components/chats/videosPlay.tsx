export default function VideosPlay(props: any) {
  const arrays = props.item;

  console.log(arrays);

  return (
    <>
      <div>
        <video
          controls
          src={arrays.url}
          autoPlay
          width={240}
          height={120}
        ></video>
        <h6>{arrays.prompt_data}</h6>
      </div>
    </>
  );
}
