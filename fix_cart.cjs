const fs = require('fs');

const file = 'src/context/ShopContext.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  /useEffect\(\(\) => \{\n    if \(\!clerkUser\) \{\n      safeSetItem\("wen_guest_cart_state", cart\);\n    \} else \{\n      safeSetItem\(`wen_user_cart_state_\$\{clerkUser\.id\}`\, cart\);\n    \}\n  \}, \[cart, clerkUser\]\);/g,
  `useEffect(() => {\n    if (!clerkLoaded) return;\n    if (!clerkUser) {\n      safeSetItem("wen_guest_cart_state", cart);\n    } else {\n      safeSetItem(\`wen_user_cart_state_\${clerkUser.id}\`, cart);\n    }\n  }, [cart]);`
);

c = c.replace(
  /const logout = async \(\) => \{\n    try \{\n      await clerkSignOut\(\);\n    \} catch \(err\) \{\n      console\.warn\("Sign out warning:", err\);\n    \}\n    setUser\(null\);\n    setProfile\(null\);\n    navigate\('home'\);\n    triggerToast\("Logged out successfully"\);\n  \};/g,
  `const logout = async () => {\n    try {\n      await clerkSignOut();\n    } catch (err) {\n      console.warn("Sign out warning:", err);\n    }\n    setUser(null);\n    setProfile(null);\n    setCart([]);\n    navigate('home');\n    triggerToast("Logged out successfully");\n  };`
);

c = c.replace(
  /\} else \{\n      \/\/ Clear the guest cart state from memory immediately when user logs in\.\n      \/\/ The actual DB cart will be loaded in the next effect\.\n      setCart\(\[\]\);\n    \}/g,
  `} else {\n      // Keep guest cart in memory so it can be merged when loadUserData fires\n    }`
);

fs.writeFileSync(file, c);
console.log("Cart fixes applied");
