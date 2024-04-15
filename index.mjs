const AWS = require('aws-sdk');

exports.handler = async (event) => {
	const ssm = new AWS.SSM();

	const commandId = await ssm.sendCommand({
		InstanceIds: ['<your instance ID>'],
		DocumentName: 'aws-RunShellScript',
		Parameters: {
			commands:['/path/to/pm2-log-s3-upload.sh']
		}
	}).promise()
	.then(data => data.Command.CommandId);

	console.log('Sent SSM command with ID: ${commandId}');

	return {
		statusCode: 200,
		body: 'Triggered Script To Process PM2 Logs'
	};
};