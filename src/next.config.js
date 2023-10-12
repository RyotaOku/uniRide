/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
}

module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/smartphoneApp/startPage', // ここを目的のページのパスに変更
        permanent: true,
      },
    ]
  },
}


module.exports = nextConfig
