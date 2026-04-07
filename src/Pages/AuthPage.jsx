import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Button,
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

const AuthPage = () => {
  const heroSliderImages = ["/slider1.PNG", "/slider1-2.PNG"];
  const secondSectionSliderImages = ["/slider2.PNG", "/slider2-2.PNG"];
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [secondSlideIndex, setSecondSlideIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setHeroSlideIndex(prev =>
        prev === heroSliderImages.length - 1 ? 0 : prev + 1
      );
    }, 4200);

    return () => clearInterval(intervalId);
  }, [heroSliderImages.length]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondSlideIndex(prev =>
        prev === secondSectionSliderImages.length - 1 ? 0 : prev + 1
      );
    }, 4200);

    return () => clearInterval(intervalId);
  }, [secondSectionSliderImages.length]);

  const sectionImageSx = {
    width: "100%",
    height: { xs: 320, md: 430 },
    objectFit: "cover",
    borderRadius: "24px",
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.14)",
  };

  const pillButtonSx = {
    borderRadius: "999px",
    px: 3,
    py: 1.15,
    fontWeight: 700,
    textTransform: "none",
    transition: "all 0.25s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 12px 22px rgba(99, 102, 241, 0.2)",
    },
  };

  const SplitSection = ({
    title,
    description,
    image,
    imageSliderImages,
    activeSlideIndex = 0,
    imageAlt,
    imageRightDesktop = false,
    actions,
  }) => (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 5, md: 8 }}
        alignItems="center"
      >
        <Box sx={{ width: { xs: "100%", md: "50%" }, order: { xs: 1, md: imageRightDesktop ? 2 : 1 } }}>
          {Array.isArray(imageSliderImages) && imageSliderImages.length > 0 ? (
            <Box sx={{ position: "relative", ...sectionImageSx, overflow: "hidden" }}>
              {imageSliderImages.map((sliderImage, index) => (
                <Box
                  key={sliderImage}
                  component="img"
                  src={sliderImage}
                  alt={`${imageAlt} ${index + 1}`}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "fill",
                    opacity: activeSlideIndex === index ? 1 : 0,
                    transition: "opacity 900ms ease-in-out",
                  }}
                />
              ))}
            </Box>
          ) : (
            <Box
              component="img"
              src={image}
              alt={imageAlt}
              sx={sectionImageSx}
            />
          )}
        </Box>
        <Box sx={{ width: { xs: "100%", md: "50%" }, order: { xs: 2, md: imageRightDesktop ? 1 : 2 } }}>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ mb: 2, letterSpacing: "0.02em" }}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3.5, whiteSpace: "pre-line" }}
          >
            {description}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {actions}
          </Box>
        </Box>
      </Stack>
    </Box>
  );

  return (
    <Box
      sx={{
        backgroundColor: "#f8fafc",
        color: "#0f172a",
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <SplitSection
          title="VERİYLE BAHİS YAPIN"
          description={"Futbol bahislerinde sezgilere degil, guclu verilere dayali kararlar alin. Platformumuz, gelismis istatistikler, gecmis mac analizleri ve gercek zamanli verilerle farkli bahis seceneklerini detayli sekilde degerlendirmenizi saglar. Akilli filtreleme araclari sayesinde oranlari karsilastirabilir, maclarin olasiliklarini daha net analiz edebilir ve riskleri daha kontrollu bir sekilde yonetebilirsiniz.\n\nBoylece yalnizca tahminlere dayali degil, veriye dayali stratejiler gelistirerek daha bilincli, daha planli ve daha surdurulebilir bahis kararlari alabilirsiniz."}
          image={heroSliderImages[heroSlideIndex]}
          imageSliderImages={heroSliderImages}
          activeSlideIndex={heroSlideIndex}
          imageAlt="Futbol sahasi gorunumu"
          actions={
            <>
              <Button
                variant="contained"
                color="error"
                sx={{ ...pillButtonSx, boxShadow: "0 10px 20px rgba(220, 38, 38, 0.24)" }}
              >
                VERI AKISLARI
              </Button>
              <Button variant="outlined" color="error" sx={pillButtonSx}>
                CANLI TAKIPCI
              </Button>
              <Button variant="outlined" color="error" sx={pillButtonSx}>
                WIDGETS
              </Button>
            </>
          }
        />

        <SplitSection
          title="EN GENIS KAPSAM"
          description="Ligdeki tum maclari, canli olasilik hareketlerini ve derin mac istatistiklerini tek bir akisla izleyin. Veri odakli kararlar icin hizli ve guvenilir altyapi."
          image={secondSectionSliderImages[secondSlideIndex]}
          imageSliderImages={secondSectionSliderImages}
          activeSlideIndex={secondSlideIndex}
          imageAlt="Stadyum ve taraftarlar"
          imageRightDesktop
          actions={
            <Button variant="contained" color="error" sx={pillButtonSx}>
              KAPSAMI GOR
            </Button>
          }
        />

        <Box sx={{ py: { xs: 8, md: 12 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 5, md: 8 }}
            alignItems="center"
          >
            <Box sx={{ width: { xs: "100%", md: "50%" }, order: { xs: 1, md: 1 } }}>
              <Box
                sx={{
                  position: "relative",
                  minHeight: { xs: 340, md: 400 },
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=900&q=80"
                  alt="YouTube canli yayin paneli"
                  sx={{
                    width: { xs: "85%", md: "82%" },
                    height: { xs: 260, md: 300 },
                    objectFit: "cover",
                    borderRadius: "24px",
                    boxShadow: "0 18px 34px rgba(15, 23, 42, 0.2)",
                  }}
                />
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80"
                  alt="Dashboard analiz ekrani"
                  sx={{
                    position: "absolute",
                    right: { xs: 0, md: 14 },
                    bottom: 0,
                    width: { xs: "62%", md: "58%" },
                    height: { xs: 190, md: 210 },
                    objectFit: "cover",
                    borderRadius: "22px",
                    border: "6px solid #f8fafc",
                    boxShadow: "0 16px 32px rgba(15, 23, 42, 0.22)",
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ width: { xs: "100%", md: "50%" }, order: { xs: 2, md: 2 } }}>
              <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
                CANLI YORUM KANALI / YOUTUBER ICIN TRACKER-PRO
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5 }}>
                Icerik ureticiler icin tasarlanan Tracker-Pro, yayina ozel veri katmanlari
                ile yorum kalitesini artirir, izleyici etkilesimini guclendirir.
              </Typography>

              <List sx={{ mb: 3, py: 0 }}>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 34 }}>
                    <CheckCircleRoundedIcon color="error" />
                  </ListItemIcon>
                  <ListItemText primary="Cok boyutlu ve derinlemesine istatistikler" />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 34 }}>
                    <CheckCircleRoundedIcon color="error" />
                  </ListItemIcon>
                  <ListItemText primary="Ozellestirilmis cozumler" />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 34 }}>
                    <CheckCircleRoundedIcon color="error" />
                  </ListItemIcon>
                  <ListItemText primary="Daha uygun maliyetli teklif" />
                </ListItem>
              </List>

              <Button variant="contained" color="error" sx={pillButtonSx}>
                DEVAMINI OKU
              </Button>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthPage;

