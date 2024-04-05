export default function SecondaryVideosPlay(props: any) {
  const arrays = props.item;

  console.log(arrays);

  return (
    <div className="flex flex-row">
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
    </div>
  );
}
