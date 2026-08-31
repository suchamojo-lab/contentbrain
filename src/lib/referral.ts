const KEY="suchamojo:referral-share-id";
export function saveReferralShareId(value:string){if(/^[a-zA-Z0-9]{8,40}$/.test(value))sessionStorage.setItem(KEY,value)}
export function referralProperties():Record<string,string>{const id=sessionStorage.getItem(KEY);return id?{referral_share_id:id,source:"public_universe"}:{};}
