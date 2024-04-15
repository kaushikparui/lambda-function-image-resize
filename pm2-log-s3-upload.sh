#!/bin/bash

# variables
pm2_log_file="$HOME/.pm2/logs/pm2-logs.log"
today=$(date +%Y-%m-%d)
temp_file="/tmp/pm2-logs-$today.log"
aws_access_key_id="Access_key"
aws_secret_access_key="Secret_key"
s3_bucket="s3_bucket_name"
s3_prefix="pm2-logs"
s3_file_name="pm2-logs-$today.log"



# Check if the file exists
if [! -f "$pm2_log_file"]; then
	echo "Error: PM2 log file not found: $pm2_log_file"
	exit 1
fi

# Grep for today's logs based on timestamp
grep "$today" "$pm2_log_file" > "$temp_file"

# (Optional) = Rename log file as per s3 bucket showcase
mv $temp_file $s3_file_name

# Check if any logs were found for today
if [! -s "$temp_file"]; then
	echo "No logs found for today: $today"
	rm -f "$temp_file"
	exit 0
fi

# Upload the temporary file to s3 bucket
aws s3 cp "$temp_file" "s3://$s3_bucket/$s3_prefix/$s3_file_name" \
	--access_key_id "$aws_access_key_id" \
	--secret_access_key "$aws_secret_access_key"

#Clean the temprary file
rm -f "$temp_file"

echo "Successfully uploaded today's pm2logs to s3 bucket: S3://$s3_bucket/$s3_prefix/$s3_file_name"