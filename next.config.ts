import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";

const localIpv4Addresses = Object.values(networkInterfaces())
  .flatMap((network) => network ?? [])
  .filter(({ family, internal }) => family === "IPv4" && !internal)
  .map(({ address }) => address);

const nextConfig: NextConfig = {
  allowedDevOrigins: localIpv4Addresses,
  images: {
    qualities: [75, 90],
  },
};

export default nextConfig;
