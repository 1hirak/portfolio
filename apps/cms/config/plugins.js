module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: '@strapi/provider-upload-aws-s3',
      providerOptions: {
        s3Options: {
          credentials: {
            accessKeyId: env('AWS_ACCESS_KEY_ID', ''),
            secretAccessKey: env('AWS_ACCESS_SECRET', ''),
          },
          region: env('AWS_REGION', 'us-east-1'),
          params: {
            Bucket: env('AWS_BUCKET', env('S3_BUCKET', '')),
            ACL: 'public-read',
          },
        },
        rootPath: env('S3_UPLOAD_PATH', 'media'),
        baseUrl: env('CDN_URL', ''),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET', env('ADMIN_JWT_SECRET')),
    },
  },
});
