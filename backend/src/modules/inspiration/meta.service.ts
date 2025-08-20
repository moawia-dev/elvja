
import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
@Injectable()
export class MetaInspirationService {
  async search(query: string, country = 'SE', limit = 25) {
    const accessToken = process.env.META_ADLIB_TOKEN ?? '';
    const url = `https://graph.facebook.com/v19.0/ads_archive?ad_reached_countries=${country}&search_terms=${encodeURIComponent(query)}&limit=${limit}&access_token=${accessToken}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Meta Ad Library fel: ${res.status}`);
    return res.json();
  }
}
