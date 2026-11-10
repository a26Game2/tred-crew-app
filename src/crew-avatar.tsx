import type { CSSProperties } from 'react';

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
const colors = ['#4A2E24', '#1F2937', '#8B4B32', '#D4A24C', '#6E4B8B', '#567345', '#3476ED', '#F26522', '#B53AC9', '#374151'];

export function CrewAvatar({ config, size = 150, animated = false }: { config?: AvatarConfig | null; size?: number; animated?: boolean }) {
  if (!config) return <div className={`crew-avatar tiger-default ${animated ? 'animated' : ''}`} style={{ '--avatar-size': `${size}px` } as CSSProperties} aria-label="Nhân vật Cổ điển TRED"><img src="/assets/tred-classic-tiger.png" alt=""/></div>;
  const value = config;
  const style = { '--avatar-size': `${size}px`, '--skin': skinColors[value.skinTone], '--hair': value.hairColor, '--outfit': value.outfitColor } as CSSProperties;
  return <div className={`crew-avatar ${animated ? 'animated' : ''} gender-${value.gender.toLowerCase()} outfit-${value.outfitStyle.toLowerCase()}`} style={style} aria-hidden="true">
    <i className="avatar-shadow"/><i className="avatar-leg left"/><i className="avatar-leg right"/><i className="avatar-shoe left"/><i className="avatar-shoe right"/><i className="avatar-body"/><i className="avatar-shirt-detail"/><i className="avatar-arm left"/><i className="avatar-arm right"/><i className="avatar-neck"/><i className="avatar-ear left"/><i className="avatar-ear right"/><i className="avatar-head"/><i className={`avatar-hair hair-${value.hairStyle.toLowerCase()}`}/><i className="avatar-eye left"/><i className="avatar-eye right"/><i className="avatar-mouth"/>
    {value.accessory !== 'NONE' && <i className={`avatar-accessory accessory-${value.accessory.toLowerCase()}`}/>}<b className="avatar-badge">T</b>
  </div>;
}

function Choice<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Array<[T, string]>; onChange: (value: T) => void }) {
  return <fieldset className="avatar-choice"><legend>{label}</legend><div>{options.map(([id, text]) => <button type="button" key={id} className={value === id ? 'selected' : ''} aria-pressed={value === id} onClick={() => onChange(id)}>{text}</button>)}</div></fieldset>;
}

export function AvatarCustomizer({ value, onChange }: { value: AvatarConfig; onChange: (value: AvatarConfig) => void }) {
  const set = <K extends keyof AvatarConfig>(key: K, next: AvatarConfig[K]) => onChange({ ...value, [key]: next });
  return <div className="avatar-customizer">
    <div className="avatar-preview"><CrewAvatar config={value} size={190} animated/><span>Nhân vật của bạn trong Văn phòng TRED</span></div>
    <Choice label="Kiểu nhân vật" value={value.gender} options={[["MASCULINE", "Nam tính"], ["FEMININE", "Nữ tính"]]} onChange={(next) => set('gender', next)}/>
    <Choice label="Màu da" value={value.skinTone} options={skinOptions} onChange={(next) => set('skinTone', next)}/>
    <Choice label="Kiểu tóc" value={value.hairStyle} options={hairOptions} onChange={(next) => set('hairStyle', next)}/>
    <fieldset className="avatar-choice color-choice"><legend>Màu tóc</legend><div>{colors.slice(0, 6).map((color) => <button type="button" key={color} className={value.hairColor === color ? 'selected' : ''} aria-label={`Màu tóc ${color}`} aria-pressed={value.hairColor === color} style={{ background: color }} onClick={() => set('hairColor', color)}/>)}</div></fieldset>
    <Choice label="Trang phục" value={value.outfitStyle} options={outfitOptions} onChange={(next) => set('outfitStyle', next)}/>
    <fieldset className="avatar-choice color-choice"><legend>Màu trang phục</legend><div>{colors.slice(5).map((color) => <button type="button" key={color} className={value.outfitColor === color ? 'selected' : ''} aria-label={`Màu trang phục ${color}`} aria-pressed={value.outfitColor === color} style={{ background: color }} onClick={() => set('outfitColor', color)}/>)}</div></fieldset>
    <Choice label="Phụ kiện" value={value.accessory} options={accessoryOptions} onChange={(next) => set('accessory', next)}/>
  </div>;
}
