---
title: "Reconnaissance vocale et commandes vocales dans les applications iOS : Retour d'expérience"
image: "/images/cover_speech_recognition.jpg"
---

# Reconnaissance vocale et commandes vocales dans les applications iOS : Retour d'expérience

L'intégration de fonctionnalités de reconnaissance vocale dans une application iOS peut considérablement améliorer l'expérience utilisateur, notamment pour les applications où l'interaction mains-libres est un avantage. Dans cet article, je partage mon expérience d'implémentation d'un système de commandes vocales dans NightTales, une application de jeu narratif, en utilisant le framework Speech d'Apple.

## Présentation du framework Speech

Introduit avec iOS 10, le framework Speech (`Speech.framework`) permet d'intégrer facilement la reconnaissance vocale dans nos applications. Il s'appuie sur les mêmes technologies que Siri et offre une API puissante qui permet de transformer la parole en texte en temps réel.

Les principales classes du framework sont :

- `SFSpeechRecognizer` : Le moteur de reconnaissance qui transforme l'audio en texte
- `SFSpeechRecognitionRequest` : Représente une requête de reconnaissance vocale
- `SFSpeechRecognitionTask` : Gère une tâche de reconnaissance en cours
- `SFTranscription` : Contient le texte transcrit et d'autres métadonnées

## Implémentation technique avec SFSpeechRecognizer

### 1. Architecture du système de commandes vocales

Pour NightTales, j'ai créé une architecture en deux composants principaux :

1. **VoiceManager** : Responsable de la capture audio et de la reconnaissance vocale
2. **VoiceCommandService** : Responsable de l'interprétation des commandes reconnues

Cette séparation des préoccupations permet de maintenir un code modulaire et testable.

### 2. Configuration initiale et gestion des permissions

Avant de pouvoir utiliser la reconnaissance vocale, plusieurs étapes de configuration sont nécessaires :



![Code Swift](images/Reconnaissance vocale et commandes vocales_screenshot_1.jpg)



### 3. Capture audio et reconnaissance vocale

Le cœur du système de reconnaissance vocale se trouve dans la méthode `startListening` :



![Code Swift](images/Reconnaissance vocale et commandes vocales_screenshot_10.jpg)



### 4. Interprétation des commandes vocales

Une fois le texte reconnu, il faut l'interpréter pour exécuter l'action correspondante. Dans NightTales, j'ai implémenté un service de correspondance qui permet de tolérer des erreurs légères dans la reconnaissance vocale :



![Code Swift](images/Reconnaissance vocale et commandes vocales_screenshot_11.jpg)



### 5. Utilisation de l'algorithme de Levenshtein pour la tolérance aux erreurs

L'algorithme de distance de Levenshtein mesure la similarité entre deux chaînes de caractères, en comptant le nombre minimum d'opérations (insertions, suppressions, substitutions) nécessaires pour transformer une chaîne en une autre :



![Code Swift](images/Reconnaissance vocale et commandes vocales_screenshot_2.jpg)



Cette approche permet de tolérer les fautes de prononciation, les variations d'accent et les erreurs de reconnaissance mineures, améliorant ainsi l'expérience utilisateur.

## Gestion des permissions utilisateur

La reconnaissance vocale nécessite des autorisations explicites de l'utilisateur pour accéder au microphone et pour effectuer la reconnaissance vocale. Voici comment gérer ces demandes de manière élégante :

### 1. Déclaration dans Info.plist

D'abord, il faut ajouter deux clés dans le fichier Info.plist :

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Nous avons besoin d'accéder au microphone pour reconnaître vos commandes vocales.</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>La reconnaissance vocale est utilisée pour convertir vos commandes en actions dans le jeu.</string>


![Code Swift](images/Reconnaissance vocale et commandes vocales_screenshot_3.jpg)

swift
func checkPermissions(completion: @escaping (Bool) -> Void) {
    let speechAuthStatus = SFSpeechRecognizer.authorizationStatus()
    
    // Si les permissions n'ont pas encore été demandées
    if speechAuthStatus == .notDetermined {
        SFSpeechRecognizer.requestAuthorization { status in
            // Une fois la réponse reçue pour la reconnaissance vocale
            if status == .authorized {
                // Demande de permission pour le microphone
                AVAudioSession.sharedInstance().requestRecordPermission { granted in
                    DispatchQueue.main.async {
                        completion(granted)
                    }
                }
            } else {
                DispatchQueue.main.async {
                    completion(false)
                }
            }
        }
    } else {
        // Si les permissions de reconnaissance vocale sont déjà accordées
        if speechAuthStatus == .authorized {
            // Vérification de l'autorisation du microphone
            AVAudioSession.sharedInstance().requestRecordPermission { granted in
                DispatchQueue.main.async {
                    completion(granted)
                }
            }
        } else {
            DispatchQueue.main.async {
                completion(false)
            }
        }
    }
}


![Code Swift](images/Reconnaissance vocale et commandes vocales_screenshot_4.jpg)

swift
// 1. Utiliser des références faibles pour éviter les cycles de rétention
recognitionTask = recognizer.recognitionTask(with: recognitionRequest) { [weak self] result, error in
    guard let self = self else { return }
    // ...
}

// 2. Arrêter proprement la reconnaissance lorsqu'elle n'est plus nécessaire
func stopListening() {
    if audioEngine.isRunning {
        audioEngine.stop()
        audioEngine.inputNode.removeTap(onBus: 0)
    }
    
    // Libérer les ressources
    recognitionRequest?.endAudio()
    recognitionRequest = nil
    
    recognitionTask?.cancel()
    recognitionTask = nil
    
    try? AVAudioSession.sharedInstance().setActive(false)
}

// 3. Gérer le cycle de vie de l'application
func applicationDidEnterBackground() {
    stopListening()
}


![Code Swift](images/Reconnaissance vocale et commandes vocales_screenshot_5.jpg)

swift
func startListeningWithTimeout() {
    startListening { text in
        // Traitement du texte reconnu
    }
    
    // Arrêt automatique après 10 secondes
    DispatchQueue.main.asyncAfter(deadline: .now() + 10) { [weak self] in
        self?.stopListening()
    }
}


![Code Swift](images/Reconnaissance vocale et commandes vocales_screenshot_6.jpg)

swift
// 1. Spécifier un contexte pour améliorer la précision
func configureRecognitionRequest() {
    recognitionRequest = SFSpeechAudioBufferRecognitionRequest()
    
    if #available(iOS 13, *) {
        // Limiter les résultats à des commandes spécifiques
        recognitionRequest?.taskHint = .dictation
        
        // Désactiver l'apprentissage à partir des entrées de l'utilisateur
        recognitionRequest?.shouldReportPartialResults = true
        recognitionRequest?.requiresOnDeviceRecognition = false
    }
}

// 2. Utiliser des locales spécifiques pour une meilleure précision
func initializeRecognizer() {
    // Utiliser la locale de l'utilisateur ou une locale spécifique
    let preferredLocale = Locale(identifier: "fr-FR")
    speechRecognizer = SFSpeechRecognizer(locale: preferredLocale)
}


![Code Swift](images/Reconnaissance vocale et commandes vocales_screenshot_7.jpg)

swift
class GameViewController: UIViewController {
    private let voiceManager = VoiceManager()
    private let commandService = VoiceCommandService()
    
    // L'interface pour démarrer l'écoute
    @IBAction func startVoiceRecognition(_ sender: UIButton) {
        voiceManager.checkPermissions { [weak self] granted in
            guard let self = self, granted else {
                self?.showPermissionAlert()
                return
            }
            
            self.voiceManager.startListening { [weak self] recognizedText in
                guard let self = self, !recognizedText.isEmpty else { return }
                
                if let choice = self.commandService.matchCommandToChoice(
                    recognizedText,
                    in: self.currentChapter,
                    tableName: "VoiceCommands"
                ) {
                    // Exécuter l'action correspondant au choix
                    self.executeChoice(choice)
                } else {
                    // Aucune correspondance trouvée
                    self.showNoMatchFeedback()
                }
            }
        }
    }
}


![Code Swift](images/Reconnaissance vocale et commandes vocales_screenshot_8.jpg)

swift
// Fichier VoiceCommands.strings (en)
"open_door" = "open door";
"run_away" = "run away";

// Fichier VoiceCommands.strings (fr)
"open_door" = "ouvrir la porte";
"run_away" = "s'enfuir";

// Utilisation
class LocalizationManager {
    static func localizedCommand(_ key: String, tableName: String) -> String {
        return NSLocalizedString(key, tableName: tableName, comment: "")
    }
}


![Code Swift](images/Reconnaissance vocale et commandes vocales_screenshot_9.jpg)

swift
class GameView: UIView {
    private let microphoneButton = UIButton()
    private let statusLabel = UILabel()
    
    func updateVoiceRecognitionStatus(isListening: Bool) {
        microphoneButton.isSelected = isListening
        
        // Feedback visuel
        if isListening {
            statusLabel.text = "J'écoute..."
            animateMicrophonePulse()
        } else {
            statusLabel.text = "Appuyez pour parler"
            stopMicrophoneAnimation()
        }
        
        // Feedback audio (optionnel)
        AudioServicesPlaySystemSound(isListening ? 1113 : 1114)
    }
    
    func showRecognizedCommand(_ text: String) {
        let feedbackView = UIView()
        let label = UILabel()
        label.text = "Commande reconnue : \(text)"
        
        // Afficher temporairement
        UIView.animate(withDuration: 0.3) {
            feedbackView.alpha = 1.0
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            UIView.animate(withDuration: 0.3) {
                feedbackView.alpha = 0.0
            }
        }
    }
}
```

## Conclusion

L'intégration de la reconnaissance vocale dans une application iOS peut sembler complexe au premier abord, mais le framework Speech d'Apple offre une API puissante et relativement simple à utiliser. Les défis principaux résident dans la gestion des permissions, l'optimisation des performances et l'interprétation des commandes reconnues.

Dans NightTales, l'utilisation de commandes vocales a considérablement amélioré l'immersion des joueurs, offrant une expérience plus naturelle et accessible. La tolérance aux erreurs via l'algorithme de Levenshtein a permis de pallier les imprécisions inhérentes à la reconnaissance vocale, rendant le système robuste et agréable à utiliser.

Pour les développeurs souhaitant implémenter cette fonctionnalité, je recommande une approche progressive :

1. Commencer par une preuve de concept simple
2. Tester extensivement avec différents accents et environnements sonores
3. Implémenter une tolérance aux erreurs
4. Optimiser les performances et la consommation d'énergie
5. Fournir un feedback clair à l'utilisateur

Avec ces bonnes pratiques, la reconnaissance vocale peut devenir un atout majeur pour votre application, offrant une expérience utilisateur enrichie et différenciante.