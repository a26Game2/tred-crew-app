import { useState, type CSSProperties, type ReactNode } from 'react';

export type AvatarConfig = {
  gender: 'MASCULINE' | 'FEMININE';
  skinTone: 'LIGHT' | 'WARM' | 'TAN' | 'DEEP';
  hairStyle: 'CLASSIC' | 'SHORT' | 'SPIKY' | 'BOB' | 'LONG';
  hairColor: string;
  outfitStyle: 'TRED' | 'CASUAL' | 'FORMAL' | 'CREATIVE';
  outfitColor: string;
  accessory: 'NONE' | 'GLASSES' | 'HEADPHONES' | 'CAP';
};

export const DEFAULT_AVATAR: AvatarConfig = { gender: 'MASCULINE', skinTone: 'WARM', hairStyle: 'CLASSIC', hairColor: '#4A2E24', outfitStyle: 'TRED', outfitColor: '#567345', accessory: 'NONE' };
const skinColors: Record<AvatarConfig['skinTone'], string> = { LIGHT: '#F7D8C2', WARM: '#E9B58F', TAN: '#C9865D', DEEP: '#81503A' };
const skinOptions: Array<[AvatarConfig['skinTone'], string]> = [['LIGHT', 'Sáng'], ['WARM', 'Ấm'], ['TAN', 'Nâu'], ['DEEP', 'Đậm']];
const hairOptions: Array<[AvatarConfig['hairStyle'], string]> = [['CLASSIC', 'Cổ điển'], ['SHORT', 'Ngắn'], ['SPIKY', 'Dựng'], ['BOB', 'Bob'], ['LONG', 'Dài']];
const outfitOptions: Array<[AvatarConfig['outfitStyle'], string]> = [['TRED', 'TRED'], ['CASUAL', 'Đời thường'], ['FORMAL', 'Công sở'], ['CREATIVE', 'Sáng tạo']];
const accessoryOptions: Array<[AvatarConfig['accessory'], string]> = [['NONE', 'Không'], ['GLASSES', 'Kính'], ['HEADPHONES', 'Tai nghe'], ['CAP', 'Mũ']];
const hairColors = ['#4A2E24', '#1F2937', '#8B4B32', '#D4A24C', '#6E4B8B', '#567345'];
const outfitColors = ['#567345', '#3476ED', '#F26522', '#B53AC9', '#374151'];

export function CrewAvatar({ config, size = 150, animated = false }: { config?: AvatarConfig | null; size?: number; animated?: boolean }) {
  if (!config) return <div className={`crew-avatar tiger-default ${animated ? 'animated' : ''}`} style={{ '--avatar-size': `${size}px` } as CSSProperties} aria-label="Nhân vật Cổ điển TRED"><img src="/assets/tred-classic-tiger.png" alt=""/></div>;
  const value = config;
  const style = { '--avatar-size': `${size}px`, '--skin': skinColors[value.skinTone], '--hair': value.hairColor, '--outfit': value.outfitColor } as CSSProperties;
  return <div className={`crew-avatar chibi-avatar ${animated ? 'animated' : ''} gender-${value.gender.toLowerCase()} style-hair-${value.hairStyle.toLowerCase()} outfit-${value.outfitStyle.toLowerCase()}`} style={style} aria-hidden="true">
    <span className="chibi-shadow"/><span className="chibi-hair-back"/>
    <span className="chibi-leg left"/><span className="chibi-leg right"/><span className="chibi-shoe left"/><span className="chibi-shoe right"/>
    <span className="chibi-body"><span className="chibi-shirt-detail"/></span>
    <span className="chibi-arm left"><span className="chibi-hand"/></span><span className="chibi-arm right"><span className="chibi-hand"/></span>
    <span className="chibi-neck"/><span className="chibi-ear left"/><span className="chibi-ear right"/><span className="chibi-head"/>
    <span className="chibi-cheek left"/><span className="chibi-cheek right"/><span className="chibi-brow left"/><span className="chibi-brow right"/>
    <span className="chibi-eye left"/><span className="chibi-eye right"/><span className="chibi-nose"/><span className="chibi-mouth"/>
    <span className="chibi-hair"><span/><span/><span/></span>
    {value.accessory !== 'NONE' && <span className={`chibi-accessory chibi-${value.accessory.toLowerCase()}`}/>}<b className="chibi-badge">T</b>
  </div>;
}

function OptionButton({ selected, label, children, onClick }: { selected: boolean; label: string; children: ReactNode; onClick: () => void }) {
  return <button type="button" className={`avatar-option ${selected ? 'selected' : ''}`} aria-pressed={selected} onClick={onClick}><span className="avatar-option-preview">{children}</span><span>{label}</span>{selected && <i aria-hidden="true">✓</i>}</button>;
}

function ColorRow<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Array<[T, string]>; onChange: (value: T) => void }) {
  return <fieldset className="customizer-row color-option-row"><legend>{label}</legend><div>{options.map(([id, text]) => <button type="button" key={id} className={value === id ? 'selected' : ''} aria-label={`${label}: ${text}`} aria-pressed={value === id} style={{ '--swatch': skinColors[id as AvatarConfig['skinTone']] || id } as CSSProperties} onClick={() => onChange(id)}><span/>{value === id && <i aria-hidden="true">✓</i>}</button>)}</div></fieldset>;
}

export function AvatarCustomizer({ value, onChange }: { value: AvatarConfig; onChange: (value: AvatarConfig) => void }) {
  const [tab, setTab] = useState<'appearance' | 'outfit' | 'accessory'>('appearance');
  const set = <K extends keyof AvatarConfig>(key: K, next: AvatarConfig[K]) => onChange({ ...value, [key]: next });
  return <div className="avatar-customizer chibi-customizer">
    <div className="avatar-preview"><div className="preview-stage"><CrewAvatar config={value} size={204} animated/></div><span>Nhân vật của bạn trong Văn phòng TRED</span></div>
    <div className="customizer-tabs" role="tablist" aria-label="Nhóm tùy chỉnh nhân vật">
      <button type="button" role="tab" aria-selected={tab === 'appearance'} className={tab === 'appearance' ? 'active' : ''} onClick={() => setTab('appearance')}>Ngoại hình</button>
      <button type="button" role="tab" aria-selected={tab === 'outfit'} className={tab === 'outfit' ? 'active' : ''} onClick={() => setTab('outfit')}>Trang phục</button>
      <button type="button" role="tab" aria-selected={tab === 'accessory'} className={tab === 'accessory' ? 'active' : ''} onClick={() => setTab('accessory')}>Phụ kiện</button>
    </div>
    <div className="customizer-panel" role="tabpanel">
      {tab === 'appearance' && <>
        <fieldset className="customizer-row"><legend>Kiểu nhân vật</legend><div className="avatar-option-grid compact">{([['MASCULINE', 'Nam tính'], ['FEMININE', 'Nữ tính']] as const).map(([id, label]) => <OptionButton key={id} label={label} selected={value.gender === id} onClick={() => set('gender', id)}><CrewAvatar config={{...value, gender:id}} size={54}/></OptionButton>)}</div></fieldset>
        <ColorRow label="Màu da" value={value.skinTone} options={skinOptions} onChange={(next) => set('skinTone', next)}/>
        <fieldset className="customizer-row"><legend>Kiểu tóc</legend><div className="avatar-option-grid">{hairOptions.map(([id, label]) => <OptionButton key={id} label={label} selected={value.hairStyle === id} onClick={() => set('hairStyle', id)}><CrewAvatar config={{...value, hairStyle:id}} size={54}/></OptionButton>)}</div></fieldset>
        <ColorRow label="Màu tóc" value={value.hairColor} options={hairColors.map(color => [color, color])} onChange={(next) => set('hairColor', next)}/>
      </>}
      {tab === 'outfit' && <>
        <fieldset className="customizer-row"><legend>Phong cách trang phục</legend><div className="avatar-option-grid outfit-grid">{outfitOptions.map(([id, label]) => <OptionButton key={id} label={label} selected={value.outfitStyle === id} onClick={() => set('outfitStyle', id)}><CrewAvatar config={{...value, outfitStyle:id}} size={58}/></OptionButton>)}</div></fieldset>
        <ColorRow label="Màu trang phục" value={value.outfitColor} options={outfitColors.map(color => [color, color])} onChange={(next) => set('outfitColor', next)}/>
      </>}
      {tab === 'accessory' && <fieldset className="customizer-row"><legend>Chọn phụ kiện</legend><div className="avatar-option-grid outfit-grid">{accessoryOptions.map(([id, label]) => <OptionButton key={id} label={label} selected={value.accessory === id} onClick={() => set('accessory', id)}><CrewAvatar config={{...value, accessory:id}} size={58}/></OptionButton>)}</div></fieldset>}
    </div>
  </div>;
}
