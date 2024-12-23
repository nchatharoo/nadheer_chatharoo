use pulldown_cmark::{Parser, Options, html};
use serde::Deserialize;
use std::fs;
use std::path::Path;
use walkdir::WalkDir;
use tera::Tera;
use chrono::Utc;

#[derive(Deserialize)]
struct FrontMatter {
    title: String,
    image: Option<String>,
}

struct Post {
    title: String,
    image: String,
    content_html: String,
    slug: String,
}

fn main() -> std::io::Result<()> {

    let config = {
        let mut c = tera::Context::new();
        c.insert("config", &serde_json::json!({
            "site_title": "Nadheer Chatharoo",
            "subtitle": "Développement iOS et plus..."
        }));
        c
    };


    if Path::new("public").exists() {
        fs::remove_dir_all("public")?;
    }
    fs::create_dir_all("public")?;
    fs::create_dir_all("public/images")?;
    fs::create_dir_all("public/posts")?;


    copy_dir_all("static", "public")?;


    let tera = match Tera::new("src/templates/*.html") {
        Ok(t) => t,
        Err(e) => {
            eprintln!("Erreur chargement templates: {}", e);
            std::process::exit(1);
        }
    };

    let mut posts = vec![];
    for entry in WalkDir::new("content/posts").into_iter().filter_map(|e| e.ok()) {
        //println!("Fichier trouvé : {:?}", entry.path());
        if entry.file_type().is_file() && entry.path().extension().and_then(|ext| ext.to_str()) == Some("md") {
            let markdown = fs::read_to_string(entry.path())?;
            //println!("Lecture du fichier : {:?}", entry.path());
            if let Some((frontmatter_str, body)) = split_frontmatter(&markdown) {
                //println!("Frontmatter détecté pour : {:?}", entry.path());
                let fm: FrontMatter = serde_yml::from_str(&frontmatter_str).expect("Frontmatter invalide");
    
                let slug = entry.path().file_stem().unwrap().to_str().unwrap().to_string();
                let image = fm.image.unwrap_or_else(|| "/images/default.jpg".to_string());
                let html_content = markdown_to_html(&body);
    
                posts.push(Post {
                    title: fm.title,
                    image,
                    content_html: html_content,
                    slug,
                });
            }
        }
    }

    for post in &posts {
        let mut ctx = config.clone();
        ctx.insert("title", &post.title);
        ctx.insert("year", &Utc::now().format("%Y").to_string());
        ctx.insert("post", &serde_json::json!({
            "title": post.title,
            "image": post.image,
            "content": post.content_html
        }));
        let rendered: String = tera.render("post.html", &ctx).unwrap();
        fs::write(format!("public/posts/{}.html", post.slug), rendered)?;
    }

    let mut ctx = config;
    ctx.insert("title", "Accueil");
    ctx.insert("year", &Utc::now().format("%Y").to_string());
    let posts_json: Vec<_> = posts.iter().map(|p| {
        serde_json::json!({
            "title": p.title,
            "image": if p.image.is_empty() { "/images/default.jpg" } else { &p.image },
            "url": format!("/posts/{}.html", p.slug)
        })
    }).collect();
    ctx.insert("posts", &posts_json);

    let index = tera.render("index.html", &ctx).unwrap();
    fs::write("public/index.html", index)?;

    Ok(())
}

fn markdown_to_html(md: &str) -> String {
    let mut options = Options::empty();
    options.insert(Options::ENABLE_STRIKETHROUGH);
    options.insert(Options::ENABLE_TABLES);
    let parser = Parser::new_ext(md, options);

    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);
    html_output
}

fn split_frontmatter(content: &str) -> Option<(String, String)> {
    let mut lines = content.lines();
    if lines.next()? == "---" {
        let mut fm = String::new();
        for line in lines.by_ref() {
            if line == "---" {
                break;
            }
            fm.push_str(line);
            fm.push('\n');
        }
        let remainder = lines.collect::<Vec<_>>().join("\n");
        Some((fm.trim().to_string(), remainder.trim().to_string()))
    } else {
        None
    }
}


fn copy_dir_all(src: &str, dst: &str) -> std::io::Result<()> {
    fs::create_dir_all(dst)?;
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let file_type = entry.file_type()?;
        let file_name = entry.file_name().to_string_lossy().to_string();

        let dest_path = format!("{}/{}", dst, file_name);

        if file_type.is_dir() {
            copy_dir_all(&entry.path().to_string_lossy(), &dest_path)?;
        } else {
            if file_name == "style.css" {
                //println!("Copie de : {}", file_name);
            }
            fs::copy(entry.path(), dest_path)?;
        }
    }
    Ok(())
}