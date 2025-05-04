import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
//for loading from online sites

  // images: {
  //   remotePatterns: [
  //     {
  //       hostname: "unsplash.com",
  //     },
  //     {
  //       hostname: "images.pixels.com",
  //     },
  //   ],
  // },

  //loading images via imagekit
  image:{
    remotePatterns:[
      {
        portocol: "https",
        hostname: "ik.imagekite.io",
        port: ""
      }
    ]
  }

};

export default nextConfig;