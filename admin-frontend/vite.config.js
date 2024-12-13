import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000, // Replace with the desired port number
	},
});


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/auth': {
//         target: 'http://login-applications.eu-north-1.elasticbeanstalk.com',
//         changeOrigin: true,
//         secure: false,
//       }
//     }
//   }
// });