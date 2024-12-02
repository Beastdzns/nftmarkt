import { useState } from 'react';
import classnames from 'classnames';
import { useAutoConnectWallet } from '@mysten/dapp-kit';
import Marketplace from './Marketplace';
import Listing from './Listing';

import './App.css';

type Tab = 'marketplace' | 'listing';

function App() {
  const [tab, setTab] = useState<Tab>('marketplace');
  const [nfcMessage, setNfcMessage] = useState<string | null>(null);

  useAutoConnectWallet();

  // Function to enable NFC connection
  const connectNFC = async () => {
    if ('NDEFReader' in window) {
      try {
        const reader = new NDEFReader();
        await reader.scan();
        setNfcMessage("Waiting for NFC tag...");
        reader.onreading = (event) => {
          const message = event.message.records[0].data;
          const walletAddress = new TextDecoder().decode(message);
          setNfcMessage(`Connected to wallet: ${walletAddress}`);
        };
        reader.onerror = () => {
          setNfcMessage("NFC read failed. Please try again.");
        };
      } catch (err) {
        setNfcMessage("NFC is not supported on this device or browser.");
      }
    } else {
      setNfcMessage("NFC is not supported on this browser or device.");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-900 via-gray-800 to-gray-900 text-white relative">
        <div className="container mx-auto px-6 py-16 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center lg:justify-between">
            <div className="lg:w-1/2">
              <h1 className="text-5xl font-bold italic mb-4">
                Bridging Bitcoin Liquidity to Sui Network
              </h1>
              <p className="text-lg max-w-lg mx-auto lg:mx-0 mb-6">
                Empowering decentralized transactions by connecting the massive liquidity
                of Bitcoin with the cutting-edge Sui ecosystem. Experience seamless,
                secure, and scalable NFT and asset trading.
              </p>
              <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg shadow-lg transition duration-300">
                Get Started
              </button>
            </div>
            <div className="mt-8 lg:mt-0 lg:w-1/2">
              <img
                src="/bridge-illustration.svg"
                alt="Bitcoin to Sui Bridge Illustration"
                className="w-full max-w-md mx-auto lg:max-w-full"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 text-white">
        <div className="container mx-auto p-4 flex justify-center">
          <ul className="flex text-sm font-medium text-center">
            <li className="me-2">
              <button
                className={classnames(
                  'inline-block px-6 py-3 rounded-lg transition duration-300',
                  tab === 'marketplace'
                    ? 'bg-blue-700 shadow-lg'
                    : 'hover:text-blue-300 hover:bg-gray-700'
                )}
                onClick={() => setTab('marketplace')}
              >
                Marketplace
              </button>
            </li>
            <li className="me-2">
              <button
                className={classnames(
                  'inline-block px-6 py-3 rounded-lg transition duration-300',
                  tab === 'listing'
                    ? 'bg-green-700 shadow-lg'
                    : 'hover:text-green-300 hover:bg-gray-700'
                )}
                onClick={() => setTab('listing')}
              >
                Listing
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="bg-gray-100 min-h-screen">
        <div className="container mx-auto px-6 py-10">
          {tab === 'marketplace' && <Marketplace />}
          {tab === 'listing' && <Listing />}
        </div>
      </main>

      {/* NFC Connect Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Claim Your NFT with NFC</h2>
          <p className="text-lg mb-6">
            Bring your NFC tag near the device to claim your NFT. Ensure your tag contains
            a valid wallet address.
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg transition duration-300"
            onClick={connectNFC}
          >
            Connect NFC
          </button>
          {nfcMessage && <p className="mt-4 text-lg">{nfcMessage}</p>}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Future of Decentralized Finance</h2>
          <p className="text-lg mb-6">
            Discover how Bitcoin liquidity can unlock new possibilities for Sui Network
            assets. Be part of the revolution today.
          </p>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-lg shadow-lg transition duration-300">
            Learn More
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            &copy; 2024 NFT Bridge. Powered by Bitcoin and Sui Ecosystems. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
