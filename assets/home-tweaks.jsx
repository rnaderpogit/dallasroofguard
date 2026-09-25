/* DallasRoofGuard — homepage Tweaks app.
   Drives theme / font / hero layout / headline copy / CTA shape via attributes
   on <html>, mirrored to localStorage so choices persist across the site. */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "ember",
  "font": "grotesk",
  "hero": "split",
  "copy": "trust",
  "cta": "rounded"
}/*EDITMODE-END*/;

const COPY_SETS = {
  trust: {
    h: 'Dallas\u2019s most trusted name in <span class="hl">premium roofing</span>.',
    s: 'Replacements, repairs, and storm restoration done with real craftsmanship and zero pressure \u2014 backed by a workmanship warranty that actually means something.',
  },
  storm: {
    h: 'Storm-ready roofs, <span class="hl">built to last</span> in North Texas.',
    s: 'Hail and high winds are no match for a roof installed right. We restore, replace, and handle the insurance claim from first photo to final shingle.',
  },
  craft: {
    h: 'Honest roofing. <span class="hl">Exceptional craft.</span>',
    s: 'A local crew that treats your home like our own \u2014 meticulous installs, spotless job sites, and recommendations you can actually trust.',
  },
};

const LS = { theme: 'drg-theme', font: 'drg-font', hero: 'drg-hero', cta: 'drg-cta', copy: 'drg-copy' };

function readInitial() {
  const init = { ...TWEAK_DEFAULTS };
  try {
    Object.keys(LS).forEach((k) => {
      const v = localStorage.getItem(LS[k]);
      if (v) init[k] = v;
    });
  } catch (e) {}
  return init;
}

function applyTweaks(t) {
  const de = document.documentElement;
  de.setAttribute('data-theme', t.theme);
  de.setAttribute('data-font', t.font);
  de.setAttribute('data-hero', t.hero);
  de.setAttribute('data-cta', t.cta);
  try {
    localStorage.setItem(LS.theme, t.theme);
    localStorage.setItem(LS.font, t.font);
    localStorage.setItem(LS.hero, t.hero);
    localStorage.setItem(LS.cta, t.cta);
    localStorage.setItem(LS.copy, t.copy);
  } catch (e) {}
  const h1 = document.getElementById('hero-headline');
  const sub = document.getElementById('hero-sub');
  const set = COPY_SETS[t.copy] || COPY_SETS.trust;
  if (h1) h1.innerHTML = set.h;
  if (sub) sub.textContent = set.s;
}

const THEME_SWATCHES = {
  ember:    ['#c2410c', '#1b1816', '#f8f6f3'],
  indigo:   ['#2f3e8c', '#121726', '#f4f6fa'],
  ironclad: ['#b5302b', '#17181b', '#f5f5f6'],
  pine:     ['#1f6047', '#18201b', '#f5f4ee'],
};

function HomeTweaks() {
  const [t, setTweak] = useTweaks(readInitial());

  React.useEffect(() => { applyTweaks(t); }, [t]);

  // Custom theme swatch row (named presets, not raw colors)
  const ThemeRow = () => (
    <div className="twk-row">
      <div className="twk-lbl"><span>Color theme</span></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
        {Object.keys(THEME_SWATCHES).map((key) => {
          const sw = THEME_SWATCHES[key];
          const active = t.theme === key;
          return (
            <button key={key} onClick={() => setTweak('theme', key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '7px 9px',
                borderRadius: 8, cursor: 'pointer', textTransform: 'capitalize',
                font: 'inherit', fontWeight: 600,
                border: active ? '1.5px solid rgba(0,0,0,.55)' : '.5px solid rgba(0,0,0,.12)',
                background: active ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,.5)',
              }}>
              <span style={{ display: 'flex' }}>
                {sw.map((c, i) => (
                  <span key={i} style={{
                    width: 13, height: 13, borderRadius: '50%', background: c,
                    border: '1px solid rgba(0,0,0,.12)', marginLeft: i ? -4 : 0,
                  }} />
                ))}
              </span>
              {key}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Brand" />
      <ThemeRow />
      <TweakSelect label="Type pairing" value={t.font}
        options={[
          { value: 'grotesk', label: 'Roboto' },
          { value: 'geometric', label: 'Roboto' },
          { value: 'mono-mix', label: 'Roboto' },
        ]}
        onChange={(v) => setTweak('font', v)} />

      <TweakSection label="Hero" />
      <TweakRadio label="Layout" value={t.hero}
        options={[
          { value: 'split', label: 'Split' },
          { value: 'overlay', label: 'Overlay' },
          { value: 'centered', label: 'Centered' },
        ]}
        onChange={(v) => setTweak('hero', v)} />
      <TweakSelect label="Headline" value={t.copy}
        options={[
          { value: 'trust', label: 'Most trusted name' },
          { value: 'storm', label: 'Storm-ready roofs' },
          { value: 'craft', label: 'Honest \u00b7 craft' },
        ]}
        onChange={(v) => setTweak('copy', v)} />

      <TweakSection label="Buttons" />
      <TweakRadio label="Corner style" value={t.cta}
        options={[
          { value: 'sharp', label: 'Sharp' },
          { value: 'rounded', label: 'Rounded' },
          { value: 'pill', label: 'Pill' },
        ]}
        onChange={(v) => setTweak('cta', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<HomeTweaks />);
