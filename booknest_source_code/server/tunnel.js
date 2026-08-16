import localtunnel from 'localtunnel';

const PORT = process.env.PORT || 3001;

async function startTunnel() {
  console.log(`📡 Starting public tunnel for BookNest on port ${PORT}...`);
  try {
    const tunnel = await localtunnel({
      port: PORT,
      subdomain: `booknest-squad-${Math.floor(1000 + Math.random() * 9000)}`
    });

    console.log(`\n======================================================`);
    console.log(`🌐 BOOKNEST LIVE PUBLIC LINK (SHARE WITH FRIENDS):`);
    console.log(`👉 ${tunnel.url}`);
    console.log(`======================================================\n`);
    console.log(`Friends can open this link on Chrome, mobile phones, tablets, or computers anywhere!\n`);

    tunnel.on('close', () => {
      console.log('Tunnel closed.');
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err);
    });
  } catch (err) {
    console.error('Failed to start tunnel:', err.message);
  }
}

startTunnel();
