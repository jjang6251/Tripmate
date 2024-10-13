# Node.js 이미지 사용
FROM node:21

# 앱 디렉토리 생성
WORKDIR /usr/src/app

# 패키지 파일 복사
COPY package*.json ./

# 패키지 설치
RUN npm install

# 소스 코드 복사
COPY . .

ARG SECRET_KEY
ARG DB_HOST
ARG DB_USER
ARG DB_PASSWORD
ARG MONGO_URI

RUN DECODED_MONGO_URI=$(echo "$MONGO_URI" | sed -e 's/%3A/:/g' -e 's/%2F/\//g' -e 's/%40/@/g' -e 's/%3F/?/g' -e 's/%3D/=/g' -e 's/%26/\&/g')

ENV DB_PASSWORD $DB_PASSWORD
ENV DB_USER $DB_USER
ENV DB_HOST $DB_HOST
ENV SECRET_KEY $SECRET_KEY
ENV MONGO_URI $MONGO_URI

# 앱 실행
CMD [ "npm", "start" ]