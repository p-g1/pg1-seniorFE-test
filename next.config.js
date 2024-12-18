/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Enable WebAssembly
    config.experiments = {
      asyncWebAssembly: true,
      layers: true
    }

     // Rule for WebAssembly files
     config.module.rules.push({
        test: /\.wasm$/,
        type: "webassembly/async",
      });
    
    // Add node.js polyfills
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: false,
      stream: false,
      path: false,
      fs: false,
      net: false,
      tls: false,
      http: false,
      https: false,
      zlib: false
    }
    
    return config
  },
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right'
  }
}

module.exports = nextConfig 