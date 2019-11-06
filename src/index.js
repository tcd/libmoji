/** Holds all possible traits and outfits */
const assets = require("./json/assets.json");

/** Holds all bitmoji template data */
const apiData = require("./json/templates.json");

/** Regular bitmoji template data */
const templates = apiData["imoji"]; // consider renaming too 'imoji' for passthrough consistency

/** Friend bitmoji (friendmoji) template data */
const friends = apiData["friends"];

/** Holds all possible genders and their values */
const genders = [["male",1],["female",2]];

/** Holds all possible avatar poses */
const poses = ["fashion","head","body"];

/** Holds all possible styles and their values */
const styles = [["bitstrips",1],["bitmoji",4],["cm",5]];

/** Holds the part of the preview avatar url that is the same for all combinations */
const basePreviewUrl = "https://preview.bitmoji.com/avatar-builder-v3/preview/";

/** Holds the part of the cpanel avatar url that is the same for all comics */
const baseCpanelUrl = "https://render.bitstrips.com/v2/cpanel/";

/** Holds the part of the render avatar url that is the same for all comics */
const baseRenderUrl = "https://render.bitstrips.com/render/";

/** Returns an object with a list of all possible traits for a gender and style */
const getTraits = (gender, style) => assets["traits"][gender][style]["categories"];

/** Returns an object with a list of all possible brands for a gender */
const getBrands = (gender) => assets["outfits"][gender]["brands"];

/** Returns an object with a list of all possible outfits for a brand */
const getOutfits = (brand) => brand["outfits"];

/** Returns an object with a list of all possible values for a trait */
const getValues = (trait) => trait["options"];

/** Returns the name of a trait as a string */
const getKey = (trait) => trait["key"];

/**Return the avatar uuid from a comic url as a string */
const getAvatarUuid = (url) => url.split('-').slice(5,10).join('-');

/** Returns the avatar id from a comic url as a string */
const getAvatarId = (url) => url.split('-').slice(1,3).join('-');

/** Returns the comic id as a string */
const getComicId = (template) => template["comic_id"];

/** Returns a random integer between 0 (included) and the max (excluded) */
const randInt = (max) => Math.floor(Math.random() * Math.floor(max));

/** Returns a random brand object which contains outfits */
const randBrand = (brands) => brands[randInt(brands.length)];

/** Returns a random outfit value as a string */
const randOutfit = (outfits) => outfits[randInt(outfits.length)]["id"];

/** Returns a random value for a trait as a string */
const randValue = (values) => values[randInt(values.length)]["value"];

/** Returns an array containing traits with random key value pairs */
const randTraits = (traits) => traits.map(trait => [getKey(trait), randValue(getValues(trait))]);

/** Map a trait object to a list of strings */
const mapTraits = (traits) => traits.map(trait => `&${trait[0]}=${trait[1]}`);

/** Return a random comic object */
const randTemplate = (templates) => templates[randInt(templates.length)];

/**
 * Return brand data:
 * - Filter out specific fields and values when `returnFilteredFields` = `false`
 * - Return only specific fields and values when `returnFilteredFields` = `true`
 */
const filterBrands = (brands, filters, returnFilteredFields = false) => {

  return brands.map((brand) => {
    const brandFilter = filters[brand.name];

    if (brandFilter !== undefined) { // filter configuration exists for this brand
      const filterKeys = Object.keys(brandFilter);

      return {
        ...brand,
        outfits: brand.outfits.filter((outfit) => {
          let filterKey, i, filterItem;

          for (i = 0; i < filterKeys.length; i++) { // iterate over filter keys; filter data
            filterKey = filterKeys[i];
            filterItem = brandFilter[filterKey].includes(outfit[filterKey]);
            if (filterItem) {
              return returnFilteredFields ? filterItem : !filterItem;
            }
          }

          return !returnFilteredFields;
        })
      };
    }

    return brand;
  });
}

/** Returns the image url of a bitmoji avatar with the specified parameters */
function buildPreviewUrl (pose, scale, gender, style, rotation, traits, outfit) {

  // use string templating to build the url
  let url = `${basePreviewUrl}${pose}?scale=${scale}&gender=${gender}&style=${style}`
  url += `&rotation=${rotation}${mapTraits(traits).join("")}&outfit=${outfit}`
  return url;
}

/** Returns the image url of a bitmoji comic with the specified paramters */
function buildCpanelUrl (comicId, avatarId, transparent, scale) {
  return `${baseCpanelUrl}${comicId}-${avatarId}-v3.png?transparent=${transparent}&scale=${scale}`;
}

/** Returns the image url of a bitmoji comic with the specified paramters */
function buildRenderUrl (comicId, avatarId, transparent, scale, outfit) {
  return `${baseRenderUrl}${comicId}/${avatarId}-v3.png?transparent=${transparent}&scale=${scale}${outfit ? `&outfit=${outfit}` : ''}`;
}

/** Returns the image url of a friendmoji comic with the specified paramters */
function buildFriendmojiUrl (comicId, avatarId1, avatarId2, transparent, scale) {
  return `${baseCpanelUrl}${comicId}-${avatarId1}-${avatarId2}-v3.png?transparent=${transparent}&scale=${scale}`;
}

// export all functions to be used
module.exports = {
  templates: templates,
  friends: friends,
  genders: genders,
  poses: poses,
  styles: styles,
  basePreviewUrl: basePreviewUrl,
  baseCpanelUrl: baseCpanelUrl,
  baseRenderUrl: baseRenderUrl,
  getTraits: getTraits,
  getBrands: getBrands,
  filterBrands: filterBrands,
  getOutfits: getOutfits,
  getValues: getValues,
  getKey: getKey,
  getAvatarUuid: getAvatarUuid,
  getAvatarId: getAvatarId,
  getComicId: getComicId,
  randInt: randInt,
  randBrand: randBrand,
  randOutfit: randOutfit,
  randValue: randValue,
  randTraits: randTraits,
  mapTraits: mapTraits,
  randTemplate: randTemplate,
  buildPreviewUrl: buildPreviewUrl,
  buildCpanelUrl:  buildCpanelUrl,
  buildRenderUrl, buildRenderUrl,
  buildFriendmojiUrl: buildFriendmojiUrl
};
