type PearlMarkProps = {
  size: number;
  variant?: "light" | "rich";
};

/** Scalable pearl-in-ring mark for favicons and app icons. */
export function PearlMark({ size, variant = "light" }: PearlMarkProps) {
  const ring = Math.round(size * 0.78);
  const pearl = Math.round(size * 0.36);
  const highlight = Math.max(2, Math.round(size * 0.07));
  const radius = Math.round(size * 0.22);

  const isRich = variant === "rich";

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isRich
          ? "linear-gradient(145deg, #A32238 0%, #8E1B2E 52%, #5C101D 100%)"
          : "radial-gradient(circle at 30% 20%, #FFFCFA 0%, #F7F0ED 42%, #EFE4DF 100%)",
        borderRadius: radius,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {!isRich && (
        <div
          style={{
            display: "flex",
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 85% 90%, rgba(142, 27, 46, 0.08) 0%, transparent 55%)",
          }}
        />
      )}

      <div
        style={{
          width: ring,
          height: ring,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `${Math.max(1, size * 0.05)}px solid ${
            isRich ? "rgba(255, 236, 240, 0.55)" : "rgba(142, 27, 46, 0.82)"
          }`,
          boxShadow: isRich
            ? "inset 0 0 0 1px rgba(255,255,255,0.08)"
            : "0 2px 10px rgba(142, 27, 46, 0.12)",
          position: "relative",
        }}
      >
        <div
          style={{
            width: pearl,
            height: pearl,
            borderRadius: "50%",
            display: "flex",
            background: isRich
              ? "radial-gradient(circle at 32% 28%, #FFFFFF 0%, #FCEFF2 38%, #E8B8C4 100%)"
              : "radial-gradient(circle at 32% 28%, #FFFFFF 0%, #FAF2F4 40%, #DDB8C0 100%)",
            boxShadow: isRich
              ? "0 2px 6px rgba(0,0,0,0.28)"
              : "0 2px 8px rgba(142, 27, 46, 0.22)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "18%",
              left: "22%",
              width: highlight,
              height: highlight,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.92)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
