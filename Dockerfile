FROM node:16-alpine3.14
WORKDIR /app
COPY . .
RUN apk --no-cache add shadow \                                                                   
    gcc \                                                                                         
    musl-dev \                                                                                    
    autoconf \                                                                                    
    automake \                                                                                    
    make \                                                                                        
    libtool \    
    libjpeg \
    jpeg-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    nasm \                                                                                        
    tiff \                                                                                        
    jpeg \                                                                                        
    zlib \                                                                                        
    zlib-dev \                                                                                    
    file \                                                                                        
    pkgconf
RUN npm install --global --force yarn
RUN yarn install
CMD ["yarn", "start"]
