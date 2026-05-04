import { useEffect } from "react";

const GPT_NETWORK_PATH = "/6355419/Travel/Europe/France/Paris";

const loadGpt = () => {
  window.googletag = window.googletag || { cmd: [] };

  if (document.querySelector('script[src*="securepubads.g.doubleclick.net/tag/js/gpt.js"]')) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
  document.head.appendChild(script);
};

const AdSlot = ({ id, sizes = [[300, 250]], style }) => {
  useEffect(() => {
    loadGpt();

    window.googletag.cmd.push(() => {
      const existingSlot = window.googletag
        .pubads()
        .getSlots()
        .find((slot) => slot.getSlotElementId() === id);

      if (!existingSlot) {
        window.googletag.defineSlot(GPT_NETWORK_PATH, sizes, id)?.addService(window.googletag.pubads());
      }

      window.googletag.setConfig({ singleRequest: true });
      window.googletag.enableServices();
      window.googletag.display(id);
    });
  }, [id, sizes]);

  return (
    <div style={{ ...styles.wrap, ...style }}>
      <span style={styles.label}>Advertisement</span>
      <div id={id} style={styles.slot} />
    </div>
  );
};

const styles = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 10,
    minHeight: 90,
    boxSizing: "border-box",
  },
  label: {
    color: "#6b7280",
    fontSize: 12,
    marginBottom: 6,
  },
  slot: {
    minWidth: 1,
    minHeight: 1,
  },
};

export default AdSlot;
