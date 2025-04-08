/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for grpc-web in Next.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
        util: false,
        url: false,
        assert: false,
        buffer: false,
        process: false,
        querystring: false,
        punycode: false,
        string_decoder: false,
        stringbuffer: false,
        sys: false,
        vm: false,
        child_process: false,
        dns: false,
        dgram: false,
        cluster: false,
        constants: false,
        domain: false,
        events: false,
        readline: false,
        repl: false,
        v8: false,
        worker_threads: false,
        // Add this to fix the 'self is not defined' error
        self: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig; 