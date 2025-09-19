# Start from the official Nginx image
FROM nginx:1.23-alpine

# Show me every file you see in the build context
RUN ls -lR


# Copy our custom default.conf to overwrite the one in the image
COPY ./conf.d/default.conf /etc/nginx/conf.d/default.conf