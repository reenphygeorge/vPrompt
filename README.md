<div align="center">
  <h1>vPrompt</h1>
  <b> Number Plate detect from video using yolov8 </b>
</div>

### Run Detection Model

1. Setup python env

       python -m venv env

2. Activate the env

       source env/bin/activate

3. Install dependencies

       pip install -r requirements.txt

4. Install dependencies

       pip install -r requirements.txt

5. Clone [Sort](https://github.com/abewley/sort) module for object tracking

       git clone https://github.com/abewley/sort.git
   
6. Download the custom trained model from [here](https://drive.google.com/file/d/10sf_Jqa6vAm73v7nRVO0oNTNqZxvyS1o/view?usp=sharing) and add it to `models` directory.

7. Download the sample video from [here](https://drive.google.com/file/d/1YmHTElM6rh5uBpvaoUYpYTHK2odJkoM6/view?usp=drive_link) and add it to `video` directory.

8. Start DB and dashboard with docker

        docker compose up

9. Run the driver code

        python main.py

10. Connect [NocoDB](https://docs.nocodb.com/data-sources/connect-to-data-source/) to view the timeseries data

        http://localhost:8085

### Train the model

- Use this jupyter [notebook](https://github.com/reenphygeorge/vPrompt/blob/main/train/video_analytics_train.ipynb) with this [dataset](https://universe.roboflow.com/roboflow-universe-projects/license-plate-recognition-rxg4e/dataset/4) for training in Google Colab.
