
import localtunnel from 'localtunnel';
(async () => {
  try {
    const tunnel = await localtunnel({ port: 3001 });
    console.log('PUBLIC_URL:' + tunnel.url);
    setTimeout(() => { tunnel.close(); process.exit(0); }, 3000);
  } catch(e) {
    console.log('ERROR:' + e.message);
    process.exit(1);
  }
})();
