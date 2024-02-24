FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /app

COPY ./api /app

RUN pip install --no-cache-dir -r requirements.txt

RUN prisma generate

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]