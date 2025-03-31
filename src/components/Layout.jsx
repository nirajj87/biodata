import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white text-center py-3 shadow-sm">
       <h1>Biodata Generator</h1>
    </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center bg-gray-100">
        {children}
      </main>

      {/* Footer */}

      <footer className="bg-primary text-white text-center py-3 mt-4">
        <div className="container">
            <div className="row">
                
                <div className="col-md-6 text-center text-md">
                    <p className="mb-0 text-white text-center">© 2025 All rights reserved. Created and developed by <a href="https://www.devsupport.co.in" className="text-white">devsupport.co.in</a> </p>
                </div>
            </div>
        </div>
    </footer>
    </div>
  );
};

export default Layout;
