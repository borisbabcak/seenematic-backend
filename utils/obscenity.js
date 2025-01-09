import { RegExpMatcher, TextCensor, englishDataset, englishRecommendedTransformers } from 'obscenity';

const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers
});

const censor = new TextCensor();

export const containsProfanity = (text) => {
    const matches = matcher.getAllMatches(text);
    return matches.length > 0;
};

export const censorText = (text) => {
    const matches = matcher.getAllMatches(text);
    return censor.applyTo(text, matches);
};