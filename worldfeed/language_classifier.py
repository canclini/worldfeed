# -*- coding: utf-8 -*-
import langid

def get_language_from_text(text):
    lang, prob = langid.classify(text)
    return lang
