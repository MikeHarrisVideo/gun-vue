/**
 * Get and handle a particular post by it's tag and hash
 * @module usePost
 */

import { computed, reactive, ref } from "vue";
import ms from "ms";
import { useGun } from "./useGun";

import { useZip } from "./useZip";

/**
 * An interface to manage a post
 * @param {String} tag
 * @param {String} hash
 * @returns {Post}
 * @example
 * const post = usePost( 'tag', postHash )
 */

export function usePost(tag = ref(""), hash = ref("")) {
  const gun = useGun();

  tag = ref(tag);
  hash = ref(hash);
  const post = computed(() => {
    const obj = reactive({
      empty: true,
      tag,
      hash,
      data: {},
      download() {
        downloadPost(post);
      },
    });

    gun
      .get(`#${tag.value}`)
      .on((d, k) => {
        obj.timestamp = d._[">"][hash.value];
        if (obj.timestamp) {
          obj.lastUpdated = ms(Date.now() - obj.timestamp);
        }
      })
      .get(hash.value)
      .on(async (d, k) => {
        let banned = await gun.get("#ban").get(k).then();
        if (tag.value != "ban" && banned) return;
        try {
          Object.assign(obj.data, JSON.parse(d));
        } catch (e) {
          obj.data.string = d;
        }
        obj.empty = false;
      });
    return obj;
  });

  return post;
}

/**
 * @typedef {Object} Post
 * @property {Boolean} empty - whether the post has contents
 * @property {String} tag - the tag under which the post was published
 * @property {String} hash - the hash of the contents
 * @property {Object} data - the contents of the post
 * @property {Function} download - use this function to download the post as a Markdown file
 * @example
 * { 
 *  "empty": false, 
 *  "tag": "ds", 
 *  "hash": "C8trDBYNyvxVedHK4Q0IuUarc/k2/iiv8opPfoAU0xA=", 
 *  "data": { 
 *    "cover": "data:image/png;base64,..........", 
 *    "icon": "data:image/png;base64,..........", 
 *    "title": "OSS", 
 *    "description": "New live album by tsoop", 
 *    "youtube": "K2MwpOd8vEI", 
 *    "content": "It's mostly op-z + op-1 with my own Unity visuals based on [Chromatone](https://chromatone.center) system.\n\n### 2021\nFirst played live at April 20th **2021**.\n\n### Into 2022\nIt's an ongoing live album to be recorded throughout the **2022**." 
 * }, 
 *  "timestamp": 1642590655747, 
 *  "lastUpdated": "1d" 
 * }
 */

export async function downloadPost(post) {
  post = ref(post);
  let postData = {
    ...post.value.data,
  };

  const { title } = postData;

  const { zipPost, downloadZip } = useZip();

  await zipPost(postData);

  downloadZip({ title });
}
