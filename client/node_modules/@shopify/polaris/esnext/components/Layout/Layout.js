import React from 'react';
import { AnnotatedSection, Section } from './components';
import styles from './Layout.scss';
export const Layout = function Layout({ sectioned, children }) {
    const content = sectioned ? <Section>{children}</Section> : children;
    return <div className={styles.Layout}>{content}</div>;
};
Layout.AnnotatedSection = AnnotatedSection;
Layout.Section = Section;
